import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { ITeam } from 'src/app/models/ITeam';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {
  public gameTimeLeft: number = 600;
  public attackTimeLeft: number = 24;
  public currentQuarter: number = 1;
  public isInterval: boolean = false;
  public teamAway!: ITeam;
  public teamHome!: ITeam;

  private gameTimerInterval: any;
  private attackTimerInterval: any;


  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.teamAway = this.gameService.teamAway;
    this.teamHome = this.gameService.teamHome;
    console.log('DisplayComponent iniciado');
    this.gameService.messages$.subscribe(message => {
      console.log('Mensagem recebida no DisplayComponent:', message);
      const msg = JSON.parse(message);
      if (msg) {
        switch (msg.type) {
          case 'START_GAME_TIME':
            this.gameTimeLeft = msg.time;
            this.startLocalGameTimer();
            break;
          case 'PAUSE_GAME_TIME':
            this.gameTimeLeft = msg.time;
            this.pauseLocalGameTimer();
            break;
          case 'RESET_GAME_TIME':
            this.gameTimeLeft = msg.time;
            this.resetLocalGameTimer();
            break;
          case 'START_ATTACK_TIME':
            this.attackTimeLeft = msg.time;
            this.startLocalAttackTimer();
            break;
          case 'PAUSE_ATTACK_TIME':
            this.attackTimeLeft = msg.time;
            this.pauseLocalAttackTimer();
            this.pauseLocalGameTimer(); // Pausa o tempo do quartil ao pausar o tempo de ataque
            break;
          case 'RESET_ATTACK_TIME':
            this.attackTimeLeft = msg.time;
            this.resetLocalAttackTimer();
            break;
          case 'UPDATE_ATTACK_TIME':
            this.attackTimeLeft = msg.time;
            break;
          case 'UPDATE_SCORE':
            if (msg.team === 'A') {
              this.teamHome.points += msg.points;
            } else if (msg.team === 'B') {
              this.teamAway.points += msg.points;
            }
            console.log(this.teamAway, this.teamHome, msg)
            break;
          case 'UPDATE_QUARTER':
            this.currentQuarter = msg.quarter;
            this.isInterval = false; // Remove a mensagem de intervalo quando o quartil é atualizado
            break;
          case 'INTERVAL':
            this.isInterval = true; // Exibe a mensagem de intervalo
            break;
          default:
            console.error('Mensagem inválida recebida:', msg);
            break;
        }
      }
    }, err => {
      console.error('Erro ao receber mensagem:', err);
    });
  }

  startLocalGameTimer() {
    if (this.gameTimerInterval) {
      clearInterval(this.gameTimerInterval);
    }
    this.gameTimerInterval = setInterval(() => {
      if (this.gameTimeLeft > 0) {
        this.gameTimeLeft -= 1;
      } else {
        clearInterval(this.gameTimerInterval);
      }
    }, 1000);
  }

  pauseLocalGameTimer() {
    if (this.gameTimerInterval) {
      clearInterval(this.gameTimerInterval);
    }
  }

  resetLocalGameTimer() {
    if (this.gameTimerInterval) {
      clearInterval(this.gameTimerInterval);
    }
  }

  startLocalAttackTimer() {
    if (this.attackTimerInterval) {
      clearInterval(this.attackTimerInterval);
    }
    this.attackTimerInterval = setInterval(() => {
      if (this.attackTimeLeft > 0) {
        this.attackTimeLeft -= 1;
      } else {
        this.attackTimeLeft = 0; // Garante que o ataque seja zero e não se torne negativo
        clearInterval(this.attackTimerInterval);
      }
    }, 1000);
  }

  pauseLocalAttackTimer() {
    if (this.attackTimerInterval) {
      clearInterval(this.attackTimerInterval);
    }
  }

  resetLocalAttackTimer() {
    if (this.attackTimerInterval) {
      clearInterval(this.attackTimerInterval);
    }
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${this.pad(mins)}:${this.pad(secs)}`;
  }

  pad(value: number): string {
    return value < 10 ? '0' + value : '' + value;
  }
}
