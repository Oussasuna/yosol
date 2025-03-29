
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
    const { transcriptId } = await req.json();
    
    if (!ASSEMBLY_API_KEY) {
      console.error("Assembly AI API key is not set");
      throw new Error('Assembly AI API key is not configured');
    }

    if (!transcriptId) {
      throw new Error('Transcript ID is required');
    }

    console.log(`Checking status of transcript ID: ${transcriptId}`);
    
    // Check the status of the transcription
    const response = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
      method: 'GET',
      headers: {
        'Authorization': ASSEMBLY_API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Assembly AI error: ${errorText}`);
      throw new Error(`Assembly AI error: ${errorText}`);
    }

    const result = await response.json();
    console.log(`Transcript status: ${result.status}`);
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in assembly-transcript-status function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
