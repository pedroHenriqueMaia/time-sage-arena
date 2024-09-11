import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VoiceControlService {
  private recognition: any;
  private isListening = false;
  private lastCommand: string | null = null;

  constructor(private zone: NgZone) {
    const { webkitSpeechRecognition }: any = window as any;
    this.recognition = new webkitSpeechRecognition();
    this.recognition.lang = 'pt-BR';
    this.recognition.continuous = true;  // Permite reconhecimento contínuo
    this.recognition.interimResults = false;

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[event.resultIndex][0].transcript.trim().toLowerCase();
      this.zone.run(() => this.handleCommand(transcript));
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };

    this.recognition.onend = () => {
      // Reinicia o reconhecimento se parar
      if (this.isListening) {
        this.recognition.start();
      }
    };
  }

  startListening() {
    if (!this.isListening) {
      this.recognition.start();
      this.isListening = true;
    }
  }

  stopListening() {
    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  private handleCommand(command: string) {
    // Verifica se o comando é diferente do último comando executado
    if (command !== this.lastCommand) {
      this.lastCommand = command; // Atualiza o último comando executado
      const event = new CustomEvent('voiceCommand', { detail: { command } });
      window.dispatchEvent(event);
    }
  }
}
