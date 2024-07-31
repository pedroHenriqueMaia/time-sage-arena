import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
  selector: '[convertToMinutes]'
})
export class ConvertToMinutesDirective {

  constructor(private el: ElementRef, private ngModel: NgModel) { }

  @HostListener('blur') onBlur() {
    let value = this.el.nativeElement.value;
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    this.ngModel.viewModel = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    this.ngModel.update.emit(this.ngModel.viewModel);
  }

  @HostListener('focus') onFocus() {
    let value = this.ngModel.viewModel;
    if (typeof value === 'string') {
      const parts = value.split(':');
      const minutes = parseInt(parts[0], 10);
      const seconds = parseInt(parts[1], 10);
      const totalSeconds = (minutes * 60) + seconds;
      this.el.nativeElement.value = totalSeconds;
    }
  }
}
