
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log("Received request to text-to-voice function");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request with CORS headers");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Parsing request body");
    const { text, voice } = await req.json();

    if (!text) {
      console.error("No text provided");
      throw new Error('Text is required');
    }

    if (!openAIApiKey) {
      console.error("OpenAI API key is not set");
      throw new Error('OpenAI API key is not configured');
    }

    console.log(`Generating speech for text: "${text}" with voice: ${voice || 'alloy'}`);

    // Generate speech from text with retry logic
    let response;
    let retries = 3;
    
    while (retries > 0) {
      try {
        response = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'tts-1',
            input: text,
            voice: voice || 'alloy',
            response_format: 'mp3',
          }),
        });
        
        if (response.ok) break;
        
        const errorText = await response.text();
        console.error(`OpenAI API error (attempt ${4-retries}): ${errorText}`);
        retries--;
        
        if (retries > 0) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, (4-retries) * 1000));
        }
      } catch (fetchError) {
        console.error(`Fetch error (attempt ${4-retries}):`, fetchError);
        retries--;
        
        if (retries > 0) {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, (4-retries) * 1000));
        } else {
          throw fetchError;
        }
      }
    }

    if (!response || !response.ok) {
      const errorData = response ? await response.json().catch(() => ({})) : {};
      console.error("OpenAI API error after retries:", errorData);
      throw new Error(errorData.error?.message || 'Failed to generate speech');
    }

    console.log("OpenAI response received, processing audio data");
    
    // Convert audio buffer to base64
    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );

    console.log("Speech generation successful, returning audio data of length:", base64Audio.length);

    return new Response(
      JSON.stringify({ audioContent: base64Audio }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error in text-to-voice function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
