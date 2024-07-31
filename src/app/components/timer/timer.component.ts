import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnChanges {
  @Input() time!: number;
  minutes: number = 0;
  seconds: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['time']) {
      this.updateTime(this.time);
    }
  }

  private updateTime(time: number): void {
    this.minutes = Math.floor(time / 60);
    this.seconds = time % 60;
  }
}
