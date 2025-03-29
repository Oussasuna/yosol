
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Define OPENAI voice types
export const OPENAI_VOICES = {
  ALLOY: 'alloy',
  ECHO: 'echo',
  FABLE: 'fable',
  ONYX: 'onyx',
  NOVA: 'nova',
  SHIMMER: 'shimmer'
};

// Define service status types
export type ServiceStatus = 'online' | 'partial' | 'offline';

/**
 * Convert Float32Array audio data to a Blob for sending to server
 */
export const audioBufferToBlob = (audioData: Float32Array): Blob => {
  // Ensure we have valid audio data
  if (!audioData || audioData.length === 0) {
    console.error('Invalid audio data provided to audioBufferToBlob');
    throw new Error('Invalid audio data');
  }

  // Convert the Float32Array to a regular array for compatibility
  const audioArray = Array.from(audioData);
  
  // Create a WAV file structure
  // WAV header is 44 bytes
  const buffer = new ArrayBuffer(44 + audioArray.length * 2);
  const view = new DataView(buffer);
  
  // Write WAV header
  // "RIFF" chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + audioArray.length * 2, true); // file size
  writeString(view, 8, 'WAVE');
  
  // "fmt " sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // subchunk1 size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, 1, true); // mono channel
  view.setUint32(24, 48000, true); // sample rate
  view.setUint32(28, 48000 * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  
  // "data" sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, audioArray.length * 2, true); // subchunk2 size
  
  // Write audio data
  const volume = 0.5;
  for (let i = 0; i < audioArray.length; i++) {
    // Scale Float32Array values to Int16 range
    const s = Math.max(-1, Math.min(1, audioArray[i]));
    view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
  
  // Create a Blob from the WAV data
  return new Blob([buffer], { type: 'audio/wav' });
  
  // Helper function to write strings to the DataView
  function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
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
 * Transcribe audio using OpenAI Whisper API via Supabase Edge Function
 */
export const transcribeAudio = async (base64Audio: string): Promise<string> => {
  if (!base64Audio || base64Audio.length === 0) {
    console.error('No audio data provided to transcribeAudio');
    return simulateTranscription();
  }

  console.log(`Sending audio data for transcription (${base64Audio.length} chars)`);
  
  try {
    const { data, error } = await supabase.functions.invoke('voice-to-text', {
      body: { audio: base64Audio }
    });

    if (error) {
      console.error('Voice transcription error from edge function:', error);
      
      // Check if it's a quota error
      if (error.message && (
          error.message.includes('quota') || 
          error.message.includes('rate limit') ||
          error.message.includes('capacity') ||
          error.message.includes('exceeded')
        )) {
        toast({
          title: "API Quota Exceeded",
          description: "Voice recognition is limited. Using simulation mode.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Voice Recognition Error",
          description: "Could not process your speech. Using simulation mode.",
          variant: "destructive"
        });
      }
      
      return simulateTranscription();
    }

    if (!data || !data.text) {
      console.error('No transcription returned from edge function');
      return simulateTranscription();
    }

    console.log("Transcription received:", data.text);
    // Return the exact transcription without any processing
    return data.text;
  } catch (error) {
    console.error('Voice transcription error:', error);
    
    toast({
      title: "Voice Recognition Failed",
      description: "Could not connect to voice service. Using simulation mode.",
      variant: "destructive"
    });
    
    return simulateTranscription();
  }
};

/**
 * Generate realistic simulated transcription results
 */
function simulateTranscription(): string {
  const simulatedTranscriptions = [
    "Show me my wallet balance.",
    "What's the current Solana price?",
    "Send five SOL to my friend's account.",
    "When was my last transaction?",
    "How many NFTs do I own?",
    "Check my staking rewards please.",
    "Give me a market update on Solana."
  ];
  
  return simulatedTranscriptions[Math.floor(Math.random() * simulatedTranscriptions.length)];
}

/**
 * Generate speech from text using OpenAI TTS API via Supabase Edge Function
 */
export const textToSpeech = async (text: string, voice: string = OPENAI_VOICES.ALLOY): Promise<string> => {
  if (!text || text.length === 0) {
    console.error('No text provided to textToSpeech');
    return '';
  }

  console.log(`Converting text to speech: "${text}" using voice: ${voice}`);
  
  try {
    const { data, error } = await supabase.functions.invoke('text-to-voice', {
      body: { text, voice }
    });

    if (error) {
      console.error('Text-to-speech error from edge function:', error);
      
      // Check if it's a quota error
      if (error.message && (
          error.message.includes('quota') || 
          error.message.includes('rate limit') ||
          error.message.includes('capacity') ||
          error.message.includes('exceeded')
        )) {
        toast({
          title: "API Quota Exceeded",
          description: "Voice generation is limited. Speech disabled.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Voice Generation Error",
          description: "Could not generate speech. Using text only mode.",
          variant: "destructive"
        });
      }
      
      return '';
    }

    if (!data || !data.audioContent) {
      console.error('No audio content returned from edge function');
      return '';
    }

    return data.audioContent;
  } catch (error) {
    console.error('Text-to-speech error:', error);
    
    toast({
      title: "Voice Generation Failed",
      description: "Could not connect to voice service. Using text only mode.",
      variant: "destructive"
    });
    
    return '';
  }
};

/**
 * Play audio from base64 string with fallback methods
 */
export const playAudioFromBase64 = async (base64Audio: string): Promise<void> => {
  if (!base64Audio || base64Audio.length === 0) {
    console.error('No audio data provided to playAudioFromBase64');
    return;
  }

  // Try multiple methods to play audio for maximum browser compatibility
  const methods = [
    playWithAudioContext,
    playWithAudioElement,
    playWithBlobURL
  ];

  // Try each method in sequence until one works
  for (const method of methods) {
    try {
      await method(base64Audio);
      console.log(`Audio played successfully using ${method.name}`);
      return;
    } catch (error) {
      console.warn(`${method.name} failed, trying next method:`, error);
    }
  }

  // If all methods fail, show an error
  console.error('All audio playback methods failed');
  toast({
    title: "Audio Playback Failed",
    description: "Could not play audio response. Check your audio settings.",
    variant: "destructive"
  });
};

/**
 * Play audio using Web Audio API
 */
async function playWithAudioContext(base64Audio: string): Promise<void> {
  // Decode base64 to binary
  const binaryString = atob(base64Audio);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  // Create audio context
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Decode audio data
  const audioBuffer = await audioContext.decodeAudioData(bytes.buffer);
  
  // Create source and play
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start(0);
  
  // Return a promise that resolves when the audio finishes playing
  return new Promise((resolve) => {
    source.onended = () => {
      resolve();
    };
  });
}

/**
 * Play audio using HTML Audio element
 */
async function playWithAudioElement(base64Audio: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
    
    audio.onended = () => resolve();
    audio.onerror = (e) => reject(new Error(`Audio playback error: ${e}`));
    
    // Some browsers need a user interaction to play audio
    // We'll try to play and catch any errors
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn('Audio element autoplay was prevented:', error);
        reject(error);
      });
    }
  });
}

/**
 * Play audio using Blob URL
 */
async function playWithBlobURL(base64Audio: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Convert base64 to blob
    const binaryString = atob(base64Audio);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const blob = new Blob([bytes], { type: 'audio/mp3' });
    const url = URL.createObjectURL(blob);
    
    const audio = new Audio(url);
    
    audio.onended = () => {
      URL.revokeObjectURL(url);
      resolve();
    };
    
    audio.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(new Error(`Blob URL audio playback error: ${e}`));
    };
    
    // Try to play
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        URL.revokeObjectURL(url);
        console.warn('Blob URL audio autoplay was prevented:', error);
        reject(error);
      });
    }
  });
}
