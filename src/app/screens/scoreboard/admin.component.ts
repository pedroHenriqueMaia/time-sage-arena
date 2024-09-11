import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from '../../services/game.service';
import { VoiceControlService } from '../../services/voice-control.service';
import { ITeam } from 'src/app/models/ITeam';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  public gameTimeLeft: number = 600;
  public attackTimeLeft: number = 24;
  public currentQuarter: number = 1;

  private gameTimerInterval: any;
  private attackTimerInterval: any;
  
  teamAway!: ITeam;
  teamHome!: ITeam;

  constructor(private gameService: GameService, private voiceControlService: VoiceControlService) { }
  ngOnInit() {
    this.teamAway = this.gameService.teamAway;
    this.teamHome = this.gameService.teamHome;
    window.addEventListener('voiceCommand', this.handleVoiceCommand.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('voiceCommand', this.handleVoiceCommand.bind(this));
  }

  startListening() {
    this.voiceControlService.startListening();
  }

  handleVoiceCommand(event: any) {
    const command = event.detail.command;
    switch (command) {
      case 'sistema':
        this.startListening();
        break;
      case 'esquerda':
        this.incrementScore('A', 2);
        break;
      case 'esquerda mais':
        this.incrementScore('A', 3);
        break;
      case 'direita':
        this.incrementScore('B', 2);
        break;
      case 'direita mais':
        this.incrementScore('B', 3);
        break;
      case 'volta':
      case 'voltar':
        this.resetAttackTimer()
        break;
      case 'para':
      case 'parar':
        this.pauseAttackTimer();
        break;
      case 'vai':
      case 'inicia':
      case 'iniciar':
        this.startAttackTimer();
        break;
      default:
        console.log('Comando não reconhecido:', command);
    }
  }

  startGameTimer() {
    if (this.gameTimerInterval) {
      clearInterval(this.gameTimerInterval);
    }
    this.gameService.sendMessage({ type: 'START_GAME_TIME', time: this.gameTimeLeft });
    this.gameTimerInterval = setInterval(() => {
      this.gameTimeLeft -= 1;
      if (this.gameTimeLeft <= 0) {
        clearInterval(this.gameTimerInterval);
      }
    }, 1000);
  }

  pauseGameTimer() {
    if (this.gameTimerInterval) {
      clearInterval(this.gameTimerInterval);
    }
    this.gameService.sendMessage({ type: 'PAUSE_GAME_TIME', time: this.gameTimeLeft });
  }

  resetGameTimer() {
    if (this.gameTimerInterval) {
      clearInterval(this.gameTimerInterval);
    }
    this.gameTimeLeft = 600;
    this.gameService.sendMessage({ type: 'RESET_GAME_TIME', time: this.gameTimeLeft });
  }

  startAttackTimer() {
    if (this.attackTimerInterval) {
      clearInterval(this.attackTimerInterval);
    }
    this.gameService.sendMessage({ type: 'START_ATTACK_TIME', time: this.attackTimeLeft });
    this.startGameTimer();
    this.attackTimerInterval = setInterval(() => {
      this.attackTimeLeft -= 1;
      if (this.attackTimeLeft <= 0) {
        this.attackTimeLeft = 0; // Garante que o ataque seja zero e não se torne negativo
        this.pauseGameTimer();
        clearInterval(this.attackTimerInterval);
      }
      // this.gameService.sendMessage({ type: 'UPDATE_ATTACK_TIME', time: this.attackTimeLeft });
    }, 1000);
  }

  pauseAttackTimer() {
    if (this.attackTimerInterval) {
      clearInterval(this.attackTimerInterval);
    }
    this.gameService.sendMessage({ type: 'PAUSE_ATTACK_TIME', time: this.attackTimeLeft });
    this.pauseGameTimer(); // Pausa o tempo do quartil ao pausar o tempo de ataque
  }

  resetAttackTimer() {
    if (this.attackTimerInterval) {
      clearInterval(this.attackTimerInterval);
    }
    this.attackTimeLeft = 24;
    this.gameService.sendMessage({ type: 'RESET_ATTACK_TIME', time: this.attackTimeLeft });
  }

  incrementScore(team: 'A' | 'B', points: number) {
    if (team === 'A') {
      this.teamHome.points += points;
    } else {
      this.teamAway.points += points;
    }
    this.pauseAttackTimer();
    this.gameService.sendMessage({ type: 'UPDATE_SCORE', team, points });
  }

  decrementScore(team: 'A' | 'B', points: number) {
    if (team === 'A') {
      this.teamHome.points = Math.max(0, this.teamHome.points - points);
    } else {
      this.teamAway.points = Math.max(0, this.teamAway.points - points);
    }
    this.gameService.sendMessage({ type: 'UPDATE_SCORE', team, points: -points });
  }

  changeQuarter(direction: number) {
    this.currentQuarter += direction;
    if (this.currentQuarter < 1) {
      this.currentQuarter = 1;
    } else if (this.currentQuarter > 4) {
      this.currentQuarter = 4;
    }
    this.gameService.sendMessage({ type: 'CHANGE_QUARTER', quarter: this.currentQuarter });
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
