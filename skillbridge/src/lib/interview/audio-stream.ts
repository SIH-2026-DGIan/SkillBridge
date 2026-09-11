// This module handles microphone capture and audio playback for Gemini Live

export class AudioStreamManager {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  
  // Callback for when we have PCM audio to send to Gemini
  public onAudioData: ((base64Pcm: string) => void) | null = null;
  
  // Audio playback queue
  private nextPlayTime = 0;
  
  async startRecording() {
    try {
      // Gemini expects 16kHz audio
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });

      // Check if any audio input devices exist before requesting them to prevent native browser console errors
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasMic = devices.some(device => device.kind === 'audioinput');
      
      if (!hasMic) {
        throw new Error("No microphone detected. Please connect a microphone to continue.");
      }

      this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
        }
      });

      this.source = this.audioContext.createMediaStreamSource(this.mediaStream);
      
      // Use ScriptProcessor for broad compatibility with 16kHz processing
      // bufferSize 4096 is a good balance between latency and performance
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        // Convert Float32Array to Int16Array
        const pcm16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          let s = Math.max(-1, Math.min(1, inputData[i]));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        
        // Convert Int16Array to Base64
        const buffer = new ArrayBuffer(pcm16.length * 2);
        const view = new DataView(buffer);
        for (let i = 0; i < pcm16.length; i++) {
          view.setInt16(i * 2, pcm16[i], true); // true = little-endian
        }
        
        // Convert to base64
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);
        
        if (this.onAudioData) {
          this.onAudioData(base64);
        }
      };

      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
      
      this.nextPlayTime = this.audioContext.currentTime + 0.1;

    } catch (err) {
      throw err;
    }
  }

  // Play audio received from Gemini
  playAudioBase64(base64Pcm: string) {
    if (!this.audioContext) return;

    // Decode Base64 to Int16Array
    const binary = atob(base64Pcm);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    const pcm16 = new Int16Array(bytes.buffer);
    
    // Convert Int16Array to Float32Array for Web Audio API
    const float32 = new Float32Array(pcm16.length);
    for (let i = 0; i < pcm16.length; i++) {
      float32[i] = pcm16[i] / 0x8000;
    }

    // Create an AudioBuffer
    const audioBuffer = this.audioContext.createBuffer(1, float32.length, 24000); // Gemini outputs 24kHz
    audioBuffer.getChannelData(0).set(float32);

    // Schedule playback
    const sourceNode = this.audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(this.audioContext.destination);
    
    const currentTime = this.audioContext.currentTime;
    if (this.nextPlayTime < currentTime) {
      this.nextPlayTime = currentTime;
    }
    
    sourceNode.start(this.nextPlayTime);
    this.nextPlayTime += audioBuffer.duration;
  }

  stop() {
    if (this.processor) {
      this.processor.disconnect();
      this.processor.onaudioprocess = null;
      this.processor = null;
    }
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
