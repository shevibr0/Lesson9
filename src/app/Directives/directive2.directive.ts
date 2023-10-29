import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appDirective2]'
})
export class Directive2Directive {


  @Input('appDirective2')
  color : string = ""

  constructor(private el : ElementRef) { }


  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.color)
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight("")
  }
  private highlight(color : string) {
    this.el.nativeElement.style.color = color
  }



}
