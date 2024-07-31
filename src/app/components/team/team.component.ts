import { Component, Input, OnInit } from '@angular/core';
import { ITeam } from 'src/app/models/ITeam';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  @Input() team: ITeam;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
  }

  // addPoints(points: number): void {
  //   if (this.team.home) {
  //     this.gameService.updateHomeTeam(this.team.points + points); // Correção se necessário
  //   } else {
  //     this.gameService.updateAwayTeam(this.team.points + points); // Correção se necessário
  //   }
  //   this.gameService.setAttackTime(24); // Reset attack time
  // }
}
