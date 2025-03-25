
import { supabase } from "@/integrations/supabase/client";

// Convert audio blob to base64
export const blobToBase64 = async (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix and get only the base64 part
      const base64 = base64String.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Convert audio buffer to a blob for recording
export const audioBufferToBlob = (buffer: Float32Array): Blob => {
  // Convert Float32Array to Int16Array for better compatibility with audio formats
  const int16Array = new Int16Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    // Convert from [-1, 1] to [-32768, 32767]
    const s = Math.max(-1, Math.min(1, buffer[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  
  return new Blob([int16Array], { type: 'audio/webm' });
};

// Retry logic for edge function calls
const retryEdgeFunction = async (
  functionName: string, 
  body: any, 
  maxRetries: number = 2
): Promise<any> => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Calling ${functionName} function, attempt ${attempt + 1}`);
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: body,
      });

      if (error) {
        console.error(`Error in ${functionName} attempt ${attempt + 1}:`, error);
        lastError = error;
        
        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 500;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        continue;
      }
      
      return data;
    } catch (error) {
      console.error(`Exception in ${functionName} attempt ${attempt + 1}:`, error);
      lastError = error;
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 500;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error(`Failed to call ${functionName} after ${maxRetries + 1} attempts`);
};

// Transcribe audio using OpenAI's Whisper API through our Supabase Edge Function
export const transcribeAudio = async (audioBase64: string): Promise<string> => {
  try {
    console.log("Invoking voice-to-text function with audio data length:", audioBase64.length);
    
    // Use retry logic for more resilience
    const data = await retryEdgeFunction('voice-to-text', { audio: audioBase64 });

    if (!data || !data.text) {
      throw new Error('No transcription returned from service');
    }

    console.log("Transcription received:", data.text);
    return data.text;
  } catch (error) {
    console.error('Voice transcription error:', error);
    throw error;
  }
};

// Available voices from OpenAI
export const OPENAI_VOICES = {
  ALLOY: 'alloy',      // Neutral/versatile
  ECHO: 'echo',        // Neutral/analytical
  FABLE: 'fable',      // Expressive/bright
  ONYX: 'onyx',        // Authoritative/deep
  NOVA: 'nova',        // Warm/friendly
  SHIMMER: 'shimmer'   // Clear/polished
};

// Generate speech from text using OpenAI's TTS API through our Supabase Edge Function
export const textToSpeech = async (
  text: string, 
  voice: string = OPENAI_VOICES.NOVA
): Promise<string> => {
  try {
    console.log("Invoking text-to-voice function with text:", text, "and voice:", voice);
    
    // Use retry logic for more resilience
    const data = await retryEdgeFunction('text-to-voice', { text, voice });

    if (!data || !data.audioContent) {
      throw new Error('No audio content returned from service');
    }

    console.log("Audio content received, length:", data.audioContent.length);
    return data.audioContent;
  } catch (error) {
    console.error('Text to speech error:', error);
    throw error;
  }
};

// Play audio from base64 string
export const playAudioFromBase64 = (base64Audio: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
      audio.onended = () => resolve();
      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        reject(e);
      };
      audio.play().catch(err => {
        console.error("Audio play error:", err);
        reject(err);
      });
    } catch (error) {
      console.error("Audio setup error:", error);
      reject(error);
    }
  });
};
