import { interviewStore } from './interview-state';
import { SYSTEM_INSTRUCTION } from './interview-prompts';

export class GeminiLiveClient {
  private ws: WebSocket | null = null;
  private apiKey: string | null = null;

  public onAudioReceived: ((base64Pcm: string) => void) | null = null;
  public onTextReceived: ((text: string, isFinal: boolean) => void) | null = null;
  public onError: ((err: Error) => void) | null = null;
  public onDisconnect: (() => void) | null = null;

  connect() {
    const config = interviewStore.getConfig();
    const token = config?.token || 'mock_token';
    const interviewId = config?.interviewId || 'mock_id';

    // The proxy runs on the configured URL (defaults to localhost:8080 during development)
    const baseUrl = process.env.NEXT_PUBLIC_GEMINI_WS_URL || 'ws://localhost:8080';
    const wsUrl = `${baseUrl}?token=${encodeURIComponent(token)}&interviewId=${encodeURIComponent(interviewId)}`;
    
    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log("Connected to Gemini Live API");
        this.sendSetupMessage();
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event);
      };

      this.ws.onerror = (error) => {
        console.error("Gemini WebSocket Error:", error);
        if (this.onError) this.onError(new Error("WebSocket Error"));
      };

      this.ws.onclose = () => {
        console.log("Disconnected from Gemini Live API");
        if (this.onDisconnect) this.onDisconnect();
      };
    } catch (err) {
      console.error("Failed to connect to Gemini Live:", err);
      if (this.onError) this.onError(err as Error);
    }
  }

  private sendSetupMessage() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const config = interviewStore.getConfig();
    const role = config?.targetRole || 'Software Engineer';
    const type = config?.type || 'Technical';
    const difficulty = config?.difficulty || 'Adaptive';

    const setupMessage = {
      setup: {
        model: "models/gemini-2.0-flash-exp",
        systemInstruction: {
          parts: [{ text: `${SYSTEM_INSTRUCTION}\n\nCandidate Target Role: ${role}\nInterview Type: ${type}\nDifficulty: ${difficulty}` }]
        },
        generationConfig: {
          responseModalities: ["AUDIO"], // Live API uses AUDIO enum and returns both audio and text transcripts
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: "Aoede" // Choose a professional voice
              }
            }
          }
        }
      }
    };

    this.ws.send(JSON.stringify(setupMessage));
  }

  sendAudio(base64Pcm: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    
    const clientContentMessage = {
      clientContent: {
        turns: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType: "audio/pcm;rate=16000",
                  data: base64Pcm
                }
              }
            ]
          }
        ],
        turnComplete: true
      }
    };
    
    this.ws.send(JSON.stringify(clientContentMessage));
  }

  sendText(text: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    
    const clientContentMessage = {
      clientContent: {
        turns: [
          {
            role: "user",
            parts: [{ text: text }]
          }
        ],
        turnComplete: true
      }
    };
    
    this.ws.send(JSON.stringify(clientContentMessage));
  }

  // Handle incoming data
  private handleMessage(event: MessageEvent) {
    if (event.data instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => {
        this.parseMessage(reader.result as string);
      };
      reader.readAsText(event.data);
    } else {
      this.parseMessage(event.data);
    }
  }

  private parseMessage(dataStr: string) {
    try {
      if (!dataStr) return;
      const message = JSON.parse(dataStr);

      if (message.serverContent) {
        const modelTurn = message.serverContent.modelTurn;
        if (modelTurn && modelTurn.parts) {
          modelTurn.parts.forEach((part: any) => {
            if (part.text && this.onTextReceived) {
              this.onTextReceived(part.text, message.serverContent.turnComplete);
            }
            if (part.inlineData && part.inlineData.data && this.onAudioReceived) {
              // Gemini returns 24kHz PCM for audio
              this.onAudioReceived(part.inlineData.data);
            }
          });
        }
      }
    } catch (e) {
      console.error("Error parsing Gemini message", e);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
