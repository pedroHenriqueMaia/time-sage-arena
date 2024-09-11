import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
  selector: '[convertToMinutes]',
  providers: [NgModel]
})
export class ConvertToMinutesDirective {

  constructor(private el: ElementRef, private model: NgModel) { }

  @HostListener('input', ['$event.target.value'])
  onInputChange(value: string) {
    const minutes = Math.floor(Number(value) / 60);
    const seconds = Number(value) % 60;
    this.model.viewModel = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value: string) {
    const [minutes, seconds] = value.split(':').map(Number);
    this.model.viewModel = (minutes * 60 + seconds).toString();
  }
}
