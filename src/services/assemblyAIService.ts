
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface TranscriptionResult {
  id: string;
  text: string;
  status: 'queued' | 'processing' | 'completed' | 'error';
  error?: string;
  words?: Array<{
    text: string;
    start: number;
    end: number;
    confidence: number;
  }>;
}

/**
 * Submits an audio file for transcription using Assembly AI
 */
export const transcribeAudio = async (
  audioBlob: Blob, 
  onProgress?: (status: string) => void
): Promise<string> => {
  try {
    onProgress?.('Converting audio to base64...');
    
    // Convert blob to base64
    const base64Audio = await blobToBase64(audioBlob);
    
    onProgress?.('Sending audio for transcription...');
    
    // Submit the transcription job
    const { data, error } = await supabase.functions.invoke('assembly-transcribe', {
      body: { audioData: base64Audio }
    });

    if (error) {
      console.error('Assembly AI transcription error:', error);
      toast({
        title: "Transcription Error",
        description: error.message || "Failed to start transcription",
        variant: "destructive"
      });
      throw error;
    }

    const { transcriptId } = data;
    
    if (!transcriptId) {
      throw new Error('No transcript ID returned');
    }
    
    onProgress?.('Transcription job submitted, waiting for results...');
    
    // Poll for the result
    const result = await pollTranscriptionResult(transcriptId, onProgress);
    
    return result.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    toast({
      title: "Transcription Failed",
      description: error.message || "Could not transcribe audio",
      variant: "destructive"
    });
    return '';
  }
};

/**
 * Polls the Assembly AI API for the transcription result
 */
export const pollTranscriptionResult = async (
  transcriptId: string,
  onProgress?: (status: string) => void,
  maxRetries = 30,
  delay = 2000
): Promise<TranscriptionResult> => {
  let retries = 0;
  
  while (retries < maxRetries) {
    const { data, error } = await supabase.functions.invoke('assembly-transcript-status', {
      body: { transcriptId }
    });
    
    if (error) {
      console.error('Error checking transcription status:', error);
      throw error;
    }
    
    if (data.status === 'completed') {
      onProgress?.('Transcription completed!');
      return data;
    } else if (data.status === 'error') {
      onProgress?.('Transcription failed: ' + (data.error || 'Unknown error'));
      throw new Error(data.error || 'Transcription failed');
    } else {
      onProgress?.(`Transcription in progress: ${data.status}`);
      retries++;
      // Wait before checking again
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Transcription timed out');
};

/**
 * Convert a Blob to a base64 string
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
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
};

/**
 * Transcribe an audio file at a URL using Assembly AI
 */
export const transcribeAudioUrl = async (
  audioUrl: string,
  onProgress?: (status: string) => void
): Promise<string> => {
  try {
    onProgress?.('Submitting URL for transcription...');
    
    // Submit the transcription job
    const { data, error } = await supabase.functions.invoke('assembly-transcribe', {
      body: { audioUrl }
    });

    if (error) {
      console.error('Assembly AI transcription error:', error);
      toast({
        title: "Transcription Error",
        description: error.message || "Failed to start transcription",
        variant: "destructive"
      });
      throw error;
    }

    const { transcriptId } = data;
    
    if (!transcriptId) {
      throw new Error('No transcript ID returned');
    }
    
    onProgress?.('Transcription job submitted, waiting for results...');
    
    // Poll for the result
    const result = await pollTranscriptionResult(transcriptId, onProgress);
    
    return result.text;
  } catch (error) {
    console.error('Error transcribing audio URL:', error);
    toast({
      title: "Transcription Failed",
      description: error.message || "Could not transcribe audio URL",
      variant: "destructive"
    });
    return '';
  }
};
