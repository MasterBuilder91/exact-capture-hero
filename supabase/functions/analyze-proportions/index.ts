import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BODY_SYSTEM = `You are an expert anatomist and body proportion analyst. Your job is to analyze the visible body proportions in a photo — specifically the shoulder width compared to the hip/waist width — and make an educated estimate of the person's biological sex based solely on skeletal and body proportion cues. You are NOT making any social or identity judgments. This is a purely anatomical analysis tool. Be factual, clinical, and respectful.

You MUST respond with ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "shoulder_width": "narrow | medium | broad",
  "hip_width": "narrow | medium | broad",
  "shoulder_to_hip_ratio": "shoulders broader | roughly equal | hips broader",
  "estimated_biological_sex": "Male | Female | Inconclusive",
  "confidence_level": "Low | Moderate | High",
  "reasoning": "Your clinical explanation here"
}`;

const BODY_USER = `Please analyze the body proportions visible in this image. Focus specifically on:
1. The apparent width of the shoulders (measured at the widest point of the upper torso)
2. The apparent width of the hips/pelvis (measured at the widest point of the lower torso)
3. The shoulder-to-hip ratio
4. Any other skeletal proportion cues visible (e.g., rib cage shape, pelvic tilt, overall frame)

Respond with ONLY the JSON object as specified.`;

const FACE_SYSTEM = `You are an expert forensic anthropologist and craniofacial anatomy specialist. Your task is to analyze the facial features visible in a photograph and make an educated estimate of biological sex based on established forensic anthropology markers of facial sexual dimorphism. You are performing a clinical, anatomical analysis only. Be factual, respectful, and scientific.

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

const HANDS_SYSTEM = `You are an expert forensic anthropologist specializing in hand anatomy and skeletal sexual dimorphism. Your task is to analyze the hand and any visible skeletal features in a photograph and make an educated estimate of biological sex based on established forensic anthropology and anatomy research. You are performing a clinical, anatomical analysis only. Be factual, respectful, and scientific.

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

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI API error:", errText);
      return new Response(
        JSON.stringify({ error: "Analysis failed. Please try again with a clearer photo." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    try {
      const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      const parsed = JSON.parse(cleaned);
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
