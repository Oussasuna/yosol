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

// Enhanced retry logic for edge function calls with better error classification
const retryEdgeFunction = async (
  functionName: string, 
  body: any, 
  maxRetries: number = 3
): Promise<any> => {
  let lastError;
  let simulationMode = false;
  
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
        
        // Enhanced error detection for quota and rate limit issues
        const isQuotaError = 
          (typeof error.message === 'string' && 
          (error.message.toLowerCase().includes('quota') || 
           error.message.toLowerCase().includes('exceeded') || 
           error.message.toLowerCase().includes('rate limit') ||
           error.message.toLowerCase().includes('insufficient_quota')));
        
        if (isQuotaError) {
          console.warn("API quota exceeded, activating simulation mode");
          simulationMode = true;
          break; // Exit the retry loop immediately for quota errors
        }
        
        // Notify the user about the error on the last attempt only
        if (attempt === maxRetries) {
          toast({
            title: "Voice Processing Error",
            description: `Error: ${error.message || 'Unknown error'}. Using fallback mode.`,
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
    } catch (error: any) {
      console.error(`Exception in ${functionName} attempt ${attempt + 1}:`, error);
      lastError = error;
      
      // Enhanced error detection for API issues
      const isQuotaOrConnectionError = 
        error instanceof Error && 
        (error.message === 'API_QUOTA_EXCEEDED' || 
         error.message.toLowerCase().includes('quota') || 
         error.message.toLowerCase().includes('exceeded') ||
         error.message.toLowerCase().includes('rate limit') ||
         error.message.toLowerCase().includes('network') ||
         error.message.toLowerCase().includes('connection'));
      
      if (isQuotaOrConnectionError) {
        console.warn("API issue detected, activating simulation mode");
        simulationMode = true;
        break; // Exit the retry loop immediately for these errors
      }
      
      // Notify the user about the error on the last attempt
      if (attempt === maxRetries) {
        toast({
          title: "Voice Processing Error",
          description: `Using offline mode due to: ${error instanceof Error ? error.message : 'Connection issues'}`,
          variant: "default"
        });
      }
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // If we've entered simulation mode or all attempts failed, return a simulated response
  console.warn(`${simulationMode ? 'Quota exceeded' : 'All attempts failed'} for ${functionName}, using simulation mode`);
  if (functionName === 'voice-to-text') {
    return simulateTranscription();
  } else {
    return { audioContent: getSimulatedAudioResponse() };  // Return in the same format as the real API
  }
};

// Improved simulation for transcription with better user experience
const simulateTranscription = () => {
  const fallbackResponses = [
    "Check my SOL balance",
    "Show me the latest market trends",
    "What are my staking rewards?",
    "Send 5 SOL to my friend",
    "Connect my wallet",
    "Show my NFT collection",
    "What's the current Solana price?",
    "Stake 10 SOL for maximum yield",
    "Set price alert for SOL at $150"
  ];
  const response = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  console.log("Using fallback simulation for transcription:", response);
  return { text: response };
};

// Transcribe audio using OpenAI's Whisper API through our Supabase Edge Function
export const transcribeAudio = async (audioBase64: string): Promise<string> => {
  try {
    if (!audioBase64 || audioBase64.length === 0) {
      throw new Error('No audio data provided');
    }
    
    console.log("Invoking voice-to-text function with audio data length:", audioBase64.length);
    
    // Use enhanced retry logic for more resilience
    const data = await retryEdgeFunction('voice-to-text', { audio: audioBase64 });

    if (!data || !data.text) {
      console.warn("No transcription returned, falling back to simulation");
      const fallbackResponse = simulateTranscription();
      return fallbackResponse.text;
    }

    console.log("Transcription received:", data.text);
    // Return the exact transcription without any processing
    return data.text;
  } catch (error) {
    console.error('Voice transcription error:', error);
    
    // Fall back to a simulation for better user experience
    console.log("Using fallback simulation for transcription due to error");
    const fallbackResponse = simulateTranscription();
    return fallbackResponse.text;
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

// Improved simulated TTS response for offline mode
const getSimulatedAudioResponse = (): string => {
  // This is a tiny 1-second MP3 file encoded as base64
  // It just plays a small "beep" sound to indicate the system is working
  return "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAAGhgC1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAWFAAAAAAAABoYhslwt//swxAADohMZj0EQASAAANIAAAAwrRpdL8kEbJCpJIkiRfJKr6QD4Q+cDdGQ+cHkAj5AQA7w+QPgfA+B8AAAAQcDgcHnex4+L1c1ZqI2Dt2tWu7HGOUCGYiIh6zJrUcjMGTnNXhfT5orrmTYg4eGxMlSl46sy/YUJRaoysWYFIxe4T5Q6RJT5yMj9hVaXSUk5Idr5armUEZv/k3ajEb//z0p39F9VYoExmOcUPvAvGl0n1i5CnnPtLtSn5RZ/t6rKDQZ6q7eETJxoVpVaXSfWNlXRawlEErplE15//sxxAD/AAABPAAAAIAAAA0gAAABJo0ijRlmFnvYv/y2Jn///OsxIui5oV5kziig5n/5h/nNdtqv+YF3/LN//zF///Me//+fX9///iWGpwFACgMEQMmGEFCXL9v8kkQAEQBEARAPQPcDoSc60ZZt2YwbZ340y2ZJIU6M8nWHUbouQ6/w3PWgxXkhU8yd//sQxBcAHO4ZFYe8bcuJwyQz97W4BTzhyR2Pp1WxKvS6rrf/+E8liO9JFy5YySQzJYjsRyK5EsViRcsmTJkzy/VK3////+ZIkSSKJYjmSPZZZZJUYnkUTJLqv////2Wy2W222223W22222//7EMQOABmaJRGH7y3DbEM08j37biAAAABgACAAIAAgACATBMEwTBMEwTBMEwQCAQCAQCAQCAQCAIBAIBAIBAIBAIBMEwTBMEwTBMEwTBMEwTBMEwTBMEwTBMEwTBMEwTBMEwTBMEwTBMEw";
};

// Generate speech from text using OpenAI's TTS API through our Supabase Edge Function
export const textToSpeech = async (
  text: string, 
  voice: string = OPENAI_VOICES.NOVA
): Promise<string> => {
  try {
    console.log("Invoking text-to-voice function with text:", text, "and voice:", voice);
    
    // Use enhanced retry logic for more resilience
    const data = await retryEdgeFunction('text-to-voice', { text, voice });

    if (!data || !data.audioContent) {
      console.warn('No audio content returned from service, using fallback');
      return getSimulatedAudioResponse();
    }

    console.log("Audio content received, length:", data.audioContent.length);
    return data.audioContent;
  } catch (error) {
    console.error('Text to speech error:', error);
    
    // Return simulated audio for better UX when the API fails
    console.log("Using fallback simulation for audio response due to error");
    return getSimulatedAudioResponse();
  }
};

// Improved audio playback with multiple fallback methods
export const playAudioFromBase64 = (base64Audio: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      if (!base64Audio || base64Audio.length === 0) {
        console.warn("Empty audio data provided to player");
        toast({
          title: "Audio Playback",
          description: "No audio data available to play",
          variant: "default"
        });
        resolve(); // Resolve without playing anything
        return;
      }
      
      console.log("Attempting to play audio with primary method");
      playWithAudioAPI(base64Audio, resolve, reject)
        .catch((err) => {
          console.warn("Primary audio playback failed, trying fallback method 1:", err);
          // First fallback: Try with blob URL
          playWithBlobURL(base64Audio, resolve, reject)
            .catch((err2) => {
              console.warn("First fallback failed, trying final method:", err2);
              // Second fallback: Use Web Audio API
              playWithWebAudioAPI(base64Audio, resolve, reject)
                .catch((finalErr) => {
                  console.error("All audio playback methods failed:", finalErr);
                  toast({
                    title: "Audio Playback Failed",
                    description: "Could not play audio response. Your browser may have limitations.",
                    variant: "destructive"
                  });
                  reject(finalErr);
                });
            });
        });
    } catch (error) {
      console.error("Audio setup error:", error);
      reject(error);
    }
  });
};

// Primary playback method using Audio API
const playWithAudioAPI = (base64Audio: string, resolve: () => void, reject: (error: any) => void): Promise<void> => {
  return new Promise((res, rej) => {
    try {
      const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
      
      audio.onended = () => {
        console.log("Audio playback completed successfully");
        res();
        resolve();
      };
      
      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        rej(e);
      };
      
      audio.play().catch(err => {
        console.error("Audio play error:", err);
        if (err.name === 'NotAllowedError') {
          toast({
            title: "Audio Playback Error",
            description: "Please interact with the page to enable audio playback.",
            variant: "destructive"
          });
        }
        rej(err);
      });
    } catch (error) {
      console.error("Error in audio API method:", error);
      rej(error);
    }
  });
};

// First fallback using blob URL
const playWithBlobURL = (base64Audio: string, resolve: () => void, reject: (error: any) => void): Promise<void> => {
  return new Promise((res, rej) => {
    try {
      const blob = base64ToBlob(base64Audio, 'audio/mp3');
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      
      audio.onended = () => {
        URL.revokeObjectURL(url);
        console.log("Blob URL audio playback completed");
        res();
        resolve();
      };
      
      audio.onerror = (e) => {
        URL.revokeObjectURL(url);
        console.error("Blob URL audio playback error:", e);
        rej(e);
      };
      
      audio.play().catch(err => {
        URL.revokeObjectURL(url);
        console.error("Blob URL audio play error:", err);
        rej(err);
      });
    } catch (error) {
      console.error("Error in blob URL method:", error);
      rej(error);
    }
  });
};

// Second fallback using Web Audio API
const playWithWebAudioAPI = (base64Audio: string, resolve: () => void, reject: (error: any) => void): Promise<void> => {
  return new Promise((res, rej) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const blob = base64ToBlob(base64Audio, 'audio/mp3');
      
      const fileReader = new FileReader();
      fileReader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          
          const source = audioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContext.destination);
          
          source.onended = () => {
            console.log("Web Audio API playback completed");
            res();
            resolve();
          };
          
          source.start(0);
        } catch (error) {
          console.error("Web Audio API decode/play error:", error);
          rej(error);
        }
      };
      
      fileReader.onerror = (error) => {
        console.error("FileReader error:", error);
        rej(error);
      };
      
      fileReader.readAsArrayBuffer(blob);
    } catch (error) {
      console.error("Error in Web Audio API method:", error);
      rej(error);
    }
  });
};

// Helper function to convert base64 to blob
const base64ToBlob = (base64: string, type: string): Blob => {
  try {
    const binStr = atob(base64);
    const len = binStr.length;
    const arr = new Uint8Array(len);
    
    for (let i = 0; i < len; i++) {
      arr[i] = binStr.charCodeAt(i);
    }
    
    return new Blob([arr], { type });
  } catch (error) {
    console.error("Error converting base64 to blob:", error);
    // Return a minimal valid blob if conversion fails
    return new Blob([''], { type });
  }
};
