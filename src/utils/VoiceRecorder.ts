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
          sampleRate: 48000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      this.audioContext = new AudioContext({
        sampleRate: 48000
      });
      
      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const audioData = new Float32Array(inputData);
        
        this.chunks.push(audioData);
        
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

export class RecordAudio {
  private recorder: VoiceRecorder;
  private audioBlob: Blob | null = null;

  constructor() {
    this.recorder = new VoiceRecorder();
  }

  async startRecording(): Promise<void> {
    await this.recorder.start();
  }

  async stopRecording(): Promise<Blob> {
    const audioData = this.recorder.stop();
    
    this.audioBlob = this.float32ArrayToBlob(audioData);
    return this.audioBlob;
  }

  private float32ArrayToBlob(audioData: Float32Array): Blob {
    if (!audioData || audioData.length === 0) {
      console.error('Invalid audio data provided');
      return new Blob([], { type: 'audio/wav' });
    }

    const audioArray = Array.from(audioData);
    
    const buffer = new ArrayBuffer(44 + audioArray.length * 2);
    const view = new DataView(buffer);
    
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + audioArray.length * 2, true);
    this.writeString(view, 8, 'WAVE');
    
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, 48000, true);
    view.setUint32(28, 48000 * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    
    this.writeString(view, 36, 'data');
    view.setUint32(40, audioArray.length * 2, true);
    
    for (let i = 0; i < audioArray.length; i++) {
      const s = Math.max(-1, Math.min(1, audioArray[i]));
      view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    
    return new Blob([buffer], { type: 'audio/wav' });
  }

  private writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
}
