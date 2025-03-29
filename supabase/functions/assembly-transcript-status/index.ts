
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const assemblyApiKey = Deno.env.get("abdf5692c84c4672a448c76c6024f2cc");

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
    const { transcriptId } = await req.json();

    if (!transcriptId) {
      throw new Error('No transcript ID provided');
    }

    // Check transcript status
    const apiUrl = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': assemblyApiKey || '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AssemblyAI API error: ${errorText}`);
    }

    const data = await response.json();
    
    return new Response(
      JSON.stringify({
        transcriptId: data.id,
        status: data.status,
        text: data.text,
        error: data.error,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in assembly-transcript-status function:', error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
