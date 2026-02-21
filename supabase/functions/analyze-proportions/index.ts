import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { AwsClient } from "jsr:@mhart/aws4fetch@1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// --- Red herring detection preamble (prepended to all system prompts) ---
const RED_HERRING_PREAMBLE = `CRITICAL INSTRUCTION — BIOLOGICAL SEX ONLY:
You are determining BIOLOGICAL/NATAL SEX based on SKELETAL STRUCTURE and BONE MORPHOLOGY only. You are NOT assessing gender identity, gender expression, or current presentation.

You MUST IGNORE the following when determining biological sex:
- Makeup, cosmetics, or beauty procedures
- Hairstyle, hair length, or hair color
- Clothing, jewelry, or accessories
- Breast tissue (can be augmented or reduced surgically)
- Soft tissue changes from hormone replacement therapy (HRT)
- Feminine or masculine presentation/styling
- Skin texture changes from hormones

Focus EXCLUSIVELY on these IMMUTABLE skeletal markers:
- Brow ridge prominence and frontal bone slope
- Orbital (eye socket) shape — square vs round
- Jaw angle, mandible width, and chin shape
- Mastoid process size (behind the ears)
- Overall cranial vault shape and size
- Shoulder-to-hip skeletal frame ratio
- Hand bone robustness and digit ratios
- Skeletal frame size relative to height

IMPORTANT PRE-ANALYSIS CHECK:
Before performing any anatomical analysis, assess the image for obstructions or red herrings:
- Masks, face coverings, or objects blocking key anatomical landmarks
- Extreme filters, distortions, or heavy photo editing
- Non-human subjects, drawings, or AI-generated images
- Clothing or accessories that completely obscure the body part being analyzed
- Angles that make reliable assessment impossible

Note: Makeup, wigs, and feminine/masculine styling are NOT obstructions — you should analyze the bone structure underneath.

If genuine obstructions are detected, include these fields:
"obstructionDetected": true,
"obstructionType": "brief description of what was detected",
"obstructionSeverity": "minor | moderate | severe"

If the obstruction is "severe", set estimatedSex/estimated_biological_sex to "Inconclusive" and confidence/confidence_level to "Low".
If no obstructions are detected, set "obstructionDetected": false.

CONFIDENCE SCORING:
You MUST include a "maleProbability" field — an integer from 0 to 100 representing the probability the subject is BIOLOGICALLY male based on SKELETAL markers only. 0 = certainly biologically female, 100 = certainly biologically male, 50 = completely uncertain. Do NOT let presentation, clothing, or cosmetic appearance influence this number.
`;

const BODY_SYSTEM = `${RED_HERRING_PREAMBLE}
You are an expert anatomist and body proportion analyst. Your job is to analyze the visible body proportions in a photo — specifically the shoulder width compared to the hip/waist width — and make an educated estimate of the person's biological sex based solely on skeletal and body proportion cues. You are NOT making any social or identity judgments. This is a purely anatomical analysis tool. Be factual, clinical, and respectful.

You MUST respond with ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "shoulder_width": "narrow | medium | broad",
  "hip_width": "narrow | medium | broad",
  "shoulder_to_hip_ratio": "shoulders broader | roughly equal | hips broader",
  "estimated_biological_sex": "Male | Female | Inconclusive",
  "confidence_level": "Low | Moderate | High",
  "maleProbability": 0-100,
  "obstructionDetected": true/false,
  "obstructionType": "description or null",
  "obstructionSeverity": "minor | moderate | severe | null",
  "reasoning": "Your clinical explanation here"
}`;

const BODY_USER = `Please analyze the body proportions visible in this image. Focus specifically on:
1. The apparent width of the shoulders (measured at the widest point of the upper torso)
2. The apparent width of the hips/pelvis (measured at the widest point of the lower torso)
3. The shoulder-to-hip ratio
4. Any other skeletal proportion cues visible (e.g., rib cage shape, pelvic tilt, overall frame)

Respond with ONLY the JSON object as specified.`;

const FACE_SYSTEM = `${RED_HERRING_PREAMBLE}
You are an expert forensic anthropologist and craniofacial anatomy specialist. Your task is to analyze the facial features visible in a photograph and make an educated estimate of biological sex based on established forensic anthropology markers of facial sexual dimorphism. You are performing a clinical, anatomical analysis only. Be factual, respectful, and scientific.

You MUST respond with ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "foreheadType": "sloped/prominent brow ridge | vertical/smooth | unclear",
  "browRidge": "prominent | subtle/absent | unclear",
  "orbitalShape": "square/rectangular | round/oval | unclear",
  "noseType": "broad/prominent | narrow/refined | unclear",
  "cheekbones": "high/prominent | flat/low | unclear",
  "jawChinType": "wide/square/angular | narrow/tapered/rounded | unclear",
  "faceShape": "rectangular/long | oval/heart-shaped | unclear",
  "glabella": "prominent | flat | unclear",
  "estimatedSex": "Male | Female | Inconclusive",
  "confidence": "Low | Moderate | High",
  "maleProbability": 0-100,
  "obstructionDetected": true/false,
  "obstructionType": "description or null",
  "obstructionSeverity": "minor | moderate | severe | null",
  "reasoning": "Your clinical explanation here"
}`;

const FACE_USER = `Analyze the facial anatomy visible in this image using established forensic anthropology and craniofacial sexual dimorphism research. Assess the following features:

1. Forehead/Frontal bone — Is it high and sloped with a prominent supraorbital (brow) ridge (male-typical), or rounder, more vertical, and smooth (female-typical)?
2. Brow ridge (supraorbital torus) — Is there a visible protruding shelf above the eye sockets (male-typical), or is the transition from forehead to eye socket smooth (female-typical)?
3. Orbital shape — Are the eye sockets more square/rectangular (male-typical) or more rounded/oval (female-typical)?
4. Nose — Is the nasal bridge broad and prominent with a larger nasal root (male-typical), or narrower and more refined (female-typical)?
5. Cheekbones (zygomatic arch) — Are cheekbones high and prominent (female-typical) or flatter (male-typical)?
6. Jaw and chin (mandible) — Is the jaw wide, square, and angular with a broad chin (male-typical), or narrower and more tapered with a rounded chin (female-typical)?
7. Overall face shape — More rectangular/longer (male-typical) or more oval/heart-shaped (female-typical)?
8. Glabella — Is the area between the brows prominent and projecting (male-typical) or flat (female-typical)?

If the face is not clearly visible or features cannot be reliably assessed, return estimatedSex as 'Inconclusive'.

Respond with ONLY the JSON object as specified.`;

const HANDS_SYSTEM = `${RED_HERRING_PREAMBLE}
You are an expert forensic anthropologist specializing in hand anatomy and skeletal sexual dimorphism. Your task is to analyze the hand and any visible skeletal features in a photograph and make an educated estimate of biological sex based on established forensic anthropology and anatomy research. You are performing a clinical, anatomical analysis only. Be factual, respectful, and scientific.

You MUST respond with ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "digitRatio": "ring longer (male-typical) | roughly equal (female-typical) | index longer | unclear",
  "handSize": "large/wide | small/narrow | medium | unclear",
  "metacarpalRobustness": "robust/thick | gracile/slender | unclear",
  "knuckleProminence": "angular/pronounced | smooth/subtle | unclear",
  "fingerTaper": "cylindrical/minimal taper | tapered toward tips | unclear",
  "wristWidth": "broad | narrow | unclear",
  "thenarEminence": "prominent | subtle | unclear",
  "clavicle": "long/robust/curved (male-typical) | short/gracile (female-typical) | not visible",
  "estimatedSex": "Male | Female | Inconclusive",
  "confidence": "Low | Moderate | High",
  "maleProbability": 0-100,
  "obstructionDetected": true/false,
  "obstructionType": "description or null",
  "obstructionSeverity": "minor | moderate | severe | null",
  "reasoning": "Your clinical explanation here"
}`;

const HANDS_USER = `Analyze the hand anatomy and any visible skeletal features in this image using established forensic anthropology and sexual dimorphism research. Assess the following:

1. 2D:4D Digit Ratio — Compare the index finger (2D) to the ring finger (4D). Is the ring finger noticeably longer than the index finger (male-typical, ratio below 1.0), or are they roughly equal or the index is longer (female-typical)?
2. Overall hand size — Does the hand appear large with a wide palm and long fingers (male-typical), or smaller with a narrower palm (female-typical)?
3. Metacarpal robustness — Do the hand bones appear thick and robust (male-typical), or more slender and gracile (female-typical)?
4. Knuckle prominence — Are the knuckles angular and pronounced (male-typical), or smoother and less prominent (female-typical)?
5. Finger taper — Do the fingers appear more cylindrical with less taper (male-typical), or do they taper more noticeably toward the fingertips (female-typical)?
6. Wrist width — Does the wrist appear broad (male-typical) or narrow (female-typical)?
7. Thenar eminence — Is the muscle bulk at the base of the thumb prominent (male-typical) or less prominent (female-typical)?
8. Clavicle (if visible in the image) — If the collarbone is visible, is it long, robust, and prominently curved (male-typical), or shorter, more gracile, and less curved (female-typical)?

Respond with ONLY the JSON object as specified.`;

const prompts: Record<string, { system: string; user: string }> = {
  body: { system: BODY_SYSTEM, user: BODY_USER },
  face: { system: FACE_SYSTEM, user: FACE_USER },
  hands: { system: HANDS_SYSTEM, user: HANDS_USER },
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

    // Strip data URL prefix if present
    const rawBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const imageBytes = Uint8Array.from(atob(rawBase64), (c) => c.charCodeAt(0));

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
    const { image, mode = "body" } = await req.json();
    if (!image) {
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

    // Run AI analysis (and Rekognition in parallel for face mode)
    const aiPromise = fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: selected.system },
          {
            role: "user",
            content: [
              { type: "text", text: selected.user },
              { type: "image_url", image_url: { url: image } },
            ],
          },
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
