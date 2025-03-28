
export class VoiceRecorder {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private chunks: Float32Array[] = [];
  private isRecording: boolean = false;

  constructor(private onAudioData?: (audioData: Float32Array) => void) {}

  async start(): Promise<void> {
    try {
      if (this.isRecording) return;
      
      this.isRecording = true;
      this.chunks = [];
      
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 48000, // Increased from 24000 for better quality
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      this.audioContext = new AudioContext({
        sampleRate: 48000, // Matched with input for consistency
      });
      
      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const audioData = new Float32Array(inputData);
        
        // Store the chunk
        this.chunks.push(audioData);
        
        // Call the callback if provided
        if (this.onAudioData) {
          this.onAudioData(audioData);
        }
      };
      
      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
      
      console.log('Voice recording started with high quality settings');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      this.isRecording = false;
      throw error;
    }
  }

  stop(): Float32Array {
    if (!this.isRecording) return new Float32Array();
    
    this.isRecording = false;
    
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    // Combine all chunks into a single Float32Array
    const totalLength = this.chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Float32Array(totalLength);
    let offset = 0;
    
    for (const chunk of this.chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    
    console.log('Voice recording stopped, total samples:', totalLength);
    return result;
  }

  isActive(): boolean {
    return this.isRecording;
  }
}
