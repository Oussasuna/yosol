
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const assemblyApiKey = Deno.env.get("ASSEMBLY_API_KEY") || "abdf5692c84c4672a448c76c6024f2cc";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audio, url } = await req.json();

    if (!audio && !url) {
      throw new Error('Either audio data or URL must be provided');
    }

    // Configure AssemblyAI API request
    const apiUrl = 'https://api.assemblyai.com/v2/transcript';
    const headers = {
      'Authorization': assemblyApiKey || '',
      'Content-Type': 'application/json',
    };

    let body;
    if (url) {
      // Use URL-based transcription
      body = JSON.stringify({
        audio_url: url,
        language_detection: true, // Auto-detect language
      });
    } else {
      // Upload audio data
      const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: {
          'Authorization': assemblyApiKey || '',
          'Content-Type': 'application/json',
        },
        body: audio, // Send the base64 audio directly
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`AssemblyAI upload failed: ${errorText}`);
      }

      const uploadResult = await uploadResponse.json();
      const uploadUrl = uploadResult.upload_url;

      if (!uploadUrl) {
        throw new Error('Failed to get upload URL from AssemblyAI');
      }

      // Now create the transcription job with the upload URL
      body = JSON.stringify({
        audio_url: uploadUrl,
        language_detection: true, // Auto-detect language
      });
    }

    // Submit the transcription job
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AssemblyAI API error: ${errorText}`);
    }

    const data = await response.json();
    
    return new Response(
      JSON.stringify({ transcriptId: data.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in assembly-transcribe function:', error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
