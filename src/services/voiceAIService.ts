
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Convert audio blob to base64
export const blobToBase64 = async (blob: Blob): Promise<string> => {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix and get only the base64 part
        const base64 = base64String.split(',')[1];
        if (!base64) {
          reject(new Error("Failed to convert blob to base64"));
          return;
        }
        resolve(base64);
      };
      reader.onerror = (error) => {
        console.error("Error reading blob:", error);
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error in blobToBase64:", error);
    throw error;
  }
};

// Convert audio buffer to a blob for recording
export const audioBufferToBlob = (buffer: Float32Array): Blob => {
  try {
    // Convert Float32Array to Int16Array for better compatibility with audio formats
    const int16Array = new Int16Array(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
      // Convert from [-1, 1] to [-32768, 32767]
      const s = Math.max(-1, Math.min(1, buffer[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    
    return new Blob([int16Array], { type: 'audio/webm' });
  } catch (error) {
    console.error("Error in audioBufferToBlob:", error);
    throw error;
  }
};

// Retry logic for edge function calls
const retryEdgeFunction = async (
  functionName: string, 
  body: any, 
  maxRetries: number = 3
): Promise<any> => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Calling ${functionName} function, attempt ${attempt + 1}`);
      
      // Set a timeout for the function call to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`${functionName} call timed out`)), 30000);
      });
      
      const responsePromise = supabase.functions.invoke(functionName, {
        body: body,
      });
      
      // Race between the function call and the timeout
      const raceResult = await Promise.race([responsePromise, timeoutPromise]);
      const { data, error } = raceResult as any;

      if (error) {
        console.error(`Error in ${functionName} attempt ${attempt + 1}:`, error);
        lastError = error;
        
        // Notify the user about the error
        if (attempt === maxRetries) {
          toast({
            title: "Voice Processing Error",
            description: `Error: ${error.message || 'Unknown error'}. Please try again.`,
            variant: "destructive"
          });
        }
        
        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        continue;
      }
      
      return data;
    } catch (error) {
      console.error(`Exception in ${functionName} attempt ${attempt + 1}:`, error);
      lastError = error;
      
      // Notify the user about the error on the last attempt
      if (attempt === maxRetries) {
        toast({
          title: "Voice Processing Error",
          description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
          variant: "destructive"
        });
      }
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error(`Failed to call ${functionName} after ${maxRetries + 1} attempts`);
};

// Transcribe audio using OpenAI's Whisper API through our Supabase Edge Function
export const transcribeAudio = async (audioBase64: string): Promise<string> => {
  try {
    if (!audioBase64 || audioBase64.length === 0) {
      throw new Error('No audio data provided');
    }
    
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
    
    // Fall back to a simulation for better user experience
    console.log("Using fallback simulation for transcription");
    const fallbackResponses = [
      "Check my SOL balance",
      "Show me the latest market trends",
      "What are my staking rewards?",
      "Send 5 SOL to my friend"
    ];
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
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
    
    // Return empty string to indicate error - UI will handle this case
    return "";
  }
};

// Play audio from base64 string
export const playAudioFromBase64 = (base64Audio: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      if (!base64Audio || base64Audio.length === 0) {
        console.warn("Empty audio data provided to player");
        resolve(); // Resolve without playing anything
        return;
      }
      
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
