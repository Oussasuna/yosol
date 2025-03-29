
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ASSEMBLY_API_KEY = Deno.env.get('ASSEMBLY_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing Assembly AI transcription request");
    const { audioData, audioUrl } = await req.json();
    
    if (!ASSEMBLY_API_KEY) {
      console.error("Assembly AI API key is not set");
      throw new Error('Assembly AI API key is not configured');
    }

    // Prepare the request to Assembly AI
    const headers = {
      'Authorization': ASSEMBLY_API_KEY,
      'Content-Type': 'application/json',
    };

    let requestBody: Record<string, any> = {};
    
    // Handle either audio URL or audio data
    if (audioUrl) {
      console.log(`Transcribing from URL: ${audioUrl}`);
      requestBody.audio_url = audioUrl;
    } else if (audioData) {
      console.log("Transcribing from uploaded audio data");
      // For uploaded data, we need to use their upload endpoint first
      const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: {
          'Authorization': ASSEMBLY_API_KEY,
        },
        body: Uint8Array.from(atob(audioData), c => c.charCodeAt(0)),
      });

      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload audio: ${await uploadResponse.text()}`);
      }

      const uploadData = await uploadResponse.json();
      requestBody.audio_url = uploadData.upload_url;
    } else {
      throw new Error('Either audioUrl or audioData must be provided');
    }

    // Add any additional transcription options
    requestBody.language_code = 'en';
    requestBody.punctuate = true;
    requestBody.format_text = true;

    // Start the transcription
    console.log("Submitting transcription request to Assembly AI");
    const response = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Assembly AI error: ${errorText}`);
      throw new Error(`Assembly AI error: ${errorText}`);
    }

    const transcriptionData = await response.json();
    
    // Assembly AI processes asynchronously, so we need to poll for the result
    const transcriptId = transcriptionData.id;
    console.log(`Transcription job submitted with ID: ${transcriptId}`);
    
    // For this edge function, we'll return the ID immediately
    // The frontend will need to poll for the result
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Transcription job submitted successfully",
        transcriptId: transcriptId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in assembly-transcribe function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
