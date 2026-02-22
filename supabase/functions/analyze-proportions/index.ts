import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { AwsClient } from "jsr:@mhart/aws4fetch@1";
import { prompts } from "./prompts.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// --- AWS Rekognition helper (Face module only) ---
async function callRekognition(imageBase64: string): Promise<{ Gender: { Value: string; Confidence: number } } | null> {
  const accessKey = Deno.env.get("AWS_ACCESS_KEY_ID");
  const secretKey = Deno.env.get("AWS_SECRET_ACCESS_KEY");
  if (!accessKey || !secretKey) {
    console.warn("AWS credentials not configured, skipping Rekognition");
    return null;
  }

  try {
    const aws = new AwsClient({ accessKeyId: accessKey, secretAccessKey: secretKey });
    const rawBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const body = JSON.stringify({
      Image: { Bytes: rawBase64 },
      Attributes: ["ALL"],
    });

    const response = await aws.fetch("https://rekognition.us-east-1.amazonaws.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "RekognitionService.DetectFaces",
      },
      body,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Rekognition error:", response.status, errText);
      return null;
    }

    const data = await response.json();
    const face = data.FaceDetails?.[0];
    if (!face?.Gender) return null;

    return { Gender: face.Gender };
  } catch (err) {
    console.error("Rekognition call failed:", err);
    return null;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image, audio, frames, mode = "body" } = await req.json();

    // Validate input based on mode
    if (mode === "voice" && !audio) {
      return new Response(JSON.stringify({ error: "No audio provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (mode === "gait" && (!frames || !frames.length)) {
      return new Response(JSON.stringify({ error: "No video frames provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (mode !== "voice" && mode !== "gait" && !image) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const selected = prompts[mode] || prompts.body;

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build user content based on mode
    let userContent: any[];
    if (mode === "voice") {
      // For voice, send audio as data URL for the AI to analyze
      userContent = [
        { type: "text", text: selected.user },
        { type: "input_audio", input_audio: { data: audio.replace(/^data:audio\/\w+;base64,/, ""), format: "wav" } },
      ];
    } else if (mode === "gait") {
      // For gait, send multiple frames as images
      userContent = [
        { type: "text", text: `${selected.user}\n\nThe following ${frames.length} images are sequential frames from a walking video, captured at regular intervals.` },
        ...frames.map((frame: string, i: number) => ({
          type: "image_url",
          image_url: { url: frame },
        })),
      ];
    } else {
      userContent = [
        { type: "text", text: selected.user },
        { type: "image_url", image_url: { url: image } },
      ];
    }

    // Choose model — use gemini-2.5-flash for most, but for voice use text-only approach
    const model = mode === "voice" ? "google/gemini-2.5-flash" : "google/gemini-2.5-flash";

    // Run AI analysis (and Rekognition in parallel for face mode)
    const aiPromise = fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: selected.system },
          { role: "user", content: userContent },
        ],
        temperature: 0.3,
      }),
    });

    const rekognitionPromise = mode === "face" ? callRekognition(image) : Promise.resolve(null);

    const [aiResponse, rekognitionResult] = await Promise.all([aiPromise, rekognitionPromise]);

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI API error:", errText);
      return new Response(
        JSON.stringify({ error: "Analysis failed. Please try again with a clearer photo." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await aiResponse.json();
    const content = data.choices?.[0]?.message?.content || "";

    try {
      const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      const parsed = JSON.parse(cleaned);

      // Clamp maleProbability to 5-95
      if (typeof parsed.maleProbability === "number") {
        parsed.maleProbability = Math.max(5, Math.min(95, parsed.maleProbability));
      }

      // Merge Rekognition data for face mode
      if (mode === "face" && rekognitionResult) {
        parsed.rekognition = {
          gender: rekognitionResult.Gender.Value,
          confidence: Math.round(rekognitionResult.Gender.Confidence * 10) / 10,
        };
      }

      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch {
      return new Response(
        JSON.stringify({
          error: "Could not parse AI response. Please try again.",
          raw: content,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (err) {
    console.error("Function error:", err);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
