
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Process base64 in chunks to prevent memory issues
function processBase64Chunks(base64String: string, chunkSize = 32768) {
  try {
    console.log("Processing base64 string of length:", base64String.length);
    
    if (!base64String || base64String.length === 0) {
      throw new Error("Empty base64 string provided");
    }
    
    const chunks: Uint8Array[] = [];
    let position = 0;
    
    while (position < base64String.length) {
      const chunk = base64String.slice(position, position + chunkSize);
      const binaryChunk = atob(chunk);
      const bytes = new Uint8Array(binaryChunk.length);
      
      for (let i = 0; i < binaryChunk.length; i++) {
        bytes[i] = binaryChunk.charCodeAt(i);
      }
      
      chunks.push(bytes);
      position += chunkSize;
    }

    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    console.log("Total bytes after processing:", totalLength);
    
    if (totalLength === 0) {
      throw new Error("Processed audio has zero length");
    }
    
    const result = new Uint8Array(totalLength);
    let offset = 0;

    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }

    return result;
  } catch (error) {
    console.error("Error processing base64 chunks:", error);
    throw error;
  }
}

serve(async (req) => {
  console.log("Received request to voice-to-text function");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request with CORS headers");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Parsing request body");
    const { audio } = await req.json();
    
    if (!audio) {
      console.error("No audio data provided");
      throw new Error('No audio data provided');
    }

    console.log("Received audio data, processing...");
    
    if (!openAIApiKey) {
      console.error("OpenAI API key is not set");
      throw new Error('OpenAI API key is not configured');
    }
    
    // Process audio in chunks
    const binaryAudio = processBase64Chunks(audio);
    
    // Prepare form data
    console.log("Preparing form data for OpenAI request");
    const formData = new FormData();
    const blob = new Blob([binaryAudio], { type: 'audio/webm' });
    formData.append('file', blob, 'audio.webm');
    formData.append('model', 'whisper-1');

    console.log("Sending request to OpenAI...");
    
    // Send to OpenAI with retry logic
    let response;
    let retries = 3;
    while (retries > 0) {
      try {
        response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
          },
          body: formData,
        });
        
        if (response.ok) break;
        
        console.error(`OpenAI API error (attempt ${4-retries}): ${await response.text()}`);
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
      const errorText = response ? await response.text() : "No response from OpenAI";
      console.error(`OpenAI API error after retries: ${errorText}`);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const result = await response.json();
    console.log("Received transcription:", result.text);

    return new Response(
      JSON.stringify({ text: result.text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in voice-to-text function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
