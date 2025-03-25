
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

// Transcribe audio using OpenAI's Whisper API through our Supabase Edge Function
export const transcribeAudio = async (audioBase64: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('voice-to-text', {
      body: { audio: audioBase64 },
    });

    if (error) {
      console.error('Error transcribing audio:', error);
      throw new Error(error.message || 'Error transcribing audio');
    }

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
    const { data, error } = await supabase.functions.invoke('text-to-voice', {
      body: { text, voice },
    });

    if (error) {
      console.error('Error generating speech:', error);
      throw new Error(error.message || 'Error generating speech');
    }

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
      audio.onerror = (e) => reject(e);
      audio.play().catch(reject);
    } catch (error) {
      reject(error);
    }
  });
};
