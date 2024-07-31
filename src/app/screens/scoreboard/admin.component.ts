import { Component } from '@angular/core';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  public gameTimeLeft: number = 600;
  public attackTimeLeft: number = 24;
  public teamAScore: number = 0;
  public teamBScore: number = 0;
  public currentQuarter: number = 1;

  private gameTimerInterval: any;
  private attackTimerInterval: any;

  constructor(private gameService: GameService) { }

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
        this.pauseGameTimer()
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

  incrementScore(team: string, points: number) {
    if (team === 'A') {
      this.teamAScore += points;
      this.gameService.sendMessage({ type: 'UPDATE_SCORE', team: 'A', score: this.teamAScore });
    } else if (team === 'B') {
      this.teamBScore += points;
      this.gameService.sendMessage({ type: 'UPDATE_SCORE', team: 'B', score: this.teamBScore });
    }
  }

  decrementScore(team: string, points: number) {
    if (team === 'A' && this.teamAScore >= points) {
      this.teamAScore -= points;
      this.gameService.sendMessage({ type: 'UPDATE_SCORE', team: 'A', score: this.teamAScore });
    } else if (team === 'B' && this.teamBScore >= points) {
      this.teamBScore -= points;
      this.gameService.sendMessage({ type: 'UPDATE_SCORE', team: 'B', score: this.teamBScore });
    }
  }

  changeQuarter(change: number) {
    if (this.currentQuarter + change >= 1 && this.currentQuarter + change <= 4) {
      this.currentQuarter += change;
      this.gameService.sendMessage({ type: 'UPDATE_QUARTER', quarter: this.currentQuarter });
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
