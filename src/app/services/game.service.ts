import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { ITeam } from '../models/ITeam';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private wsUrl = 'ws://localhost:8080';
  private socket$: WebSocketSubject<any>;
  
  public messages$ = new Subject<any>();

  teamAway: ITeam = { home: true, logo: '../../assets/lakers.jpeg', name: 'Los Angeles Lakers',points:0 };
  teamHome: ITeam = { home: true, logo: '../../assets/wolves.jpeg', name: 'Wolves',points:0 };
  

  constructor() {
    this.socket$ = webSocket({
      url: this.wsUrl,
      deserializer: msg => {
        console.log('Mensagem recebida do WebSocket:', msg);
        // Tenta converter a mensagem recebida em JSON
        try {
          return JSON.parse(msg.data);
        } catch (e) {
          console.error('Erro ao converter a mensagem para JSON:', e);
          return { type: 'ERROR', message: 'Invalid JSON' };
        }
      }
    });

    this.socket$.subscribe({
      next: (msg) => this.messages$.next(msg),
      error: (err) => console.error('WebSocket error: ', err),
      complete: () => console.log('WebSocket connection closed')
    });
  }

  sendMessage(msg: any) {
    // Certifica-se de que a mensagem seja uma string JSON
    this.socket$.next(JSON.stringify(msg));
  }
}
