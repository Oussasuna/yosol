
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

/**
 * Transcribe an audio file using AssemblyAI via Supabase Edge Function
 */
export const transcribeAudio = async (
  audioFile: Blob, 
  onProgressUpdate?: (status: string) => void
): Promise<string> {
  try {
    onProgressUpdate?.('Converting audio to base64...');
    
    // Convert the audio blob to base64
    const base64Audio = await blobToBase64(audioFile);
    
    onProgressUpdate?.('Uploading audio to AssemblyAI...');
    
    // Submit the audio for transcription
    const { data: submitData, error: submitError } = await supabase.functions.invoke('assembly-transcribe', {
      body: { audio: base64Audio }
    });

    if (submitError) {
      console.error('Error submitting audio for transcription:', submitError);
      throw new Error(`Transcription submission failed: ${submitError.message}`);
    }

    if (!submitData || !submitData.transcriptId) {
      throw new Error('No transcript ID returned from submission');
    }

    const transcriptId = submitData.transcriptId;
    onProgressUpdate?.(`Transcription started with ID: ${transcriptId}`);
    
    // Poll for the transcription result
    return await pollForTranscriptResult(transcriptId, onProgressUpdate);
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
};

/**
 * Transcribe audio from a URL using AssemblyAI
 */
export const transcribeAudioUrl = async (
  audioUrl: string,
  onProgressUpdate?: (status: string) => void
): Promise<string> {
  try {
    onProgressUpdate?.('Submitting URL for transcription...');
    
    // Submit the URL for transcription
    const { data: submitData, error: submitError } = await supabase.functions.invoke('assembly-transcribe', {
      body: { url: audioUrl }
    });

    if (submitError) {
      console.error('Error submitting URL for transcription:', submitError);
      throw new Error(`Transcription submission failed: ${submitError.message}`);
    }

    if (!submitData || !submitData.transcriptId) {
      throw new Error('No transcript ID returned from submission');
    }

    const transcriptId = submitData.transcriptId;
    onProgressUpdate?.(`Transcription started with ID: ${transcriptId}`);
    
    // Poll for the transcription result
    return await pollForTranscriptResult(transcriptId, onProgressUpdate);
  } catch (error) {
    console.error('Error transcribing audio URL:', error);
    throw error;
  }
};

/**
 * Poll for transcript status until it's completed
 */
async function pollForTranscriptResult(
  transcriptId: string,
  onProgressUpdate?: (status: string) => void,
  maxAttempts = 30
): Promise<string> {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    attempts++;
    
    try {
      onProgressUpdate?.(`Checking transcription status (attempt ${attempts})...`);
      
      // Wait a bit before checking (longer for later attempts)
      await new Promise(resolve => setTimeout(resolve, attempts < 5 ? 3000 : 5000));
      
      const { data: statusData, error: statusError } = await supabase.functions.invoke('assembly-transcript-status', {
        body: { transcriptId }
      });
      
      if (statusError) {
        console.error('Error checking transcript status:', statusError);
        continue;
      }

      if (!statusData) {
        console.warn('No status data returned');
        continue;
      }
      
      // Handle different status cases
      if (statusData.status === 'completed') {
        onProgressUpdate?.('Transcription completed!');
        return statusData.text || '';
      } else if (statusData.status === 'error') {
        throw new Error(`Transcription failed: ${statusData.error || 'Unknown error'}`);
      } else {
        // Still processing
        onProgressUpdate?.(`Transcription in progress (status: ${statusData.status})...`);
      }
    } catch (error) {
      console.error('Error polling for transcript:', error);
      // Don't throw here, just try again
    }
  }
  
  throw new Error('Transcription timed out after maximum attempts');
}

/**
 * Convert a Blob to a base64 string
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Extract the base64 part only (remove data:audio/wav;base64, prefix)
      const base64 = base64String.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
