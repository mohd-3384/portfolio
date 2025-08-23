import { Component } from '@angular/core';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { StaggerChildrenDirective } from '../../shared/directives/stagger-children.directive';
import { SplitLettersDirective } from '../../shared/directives/split-letters.directive';


@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RevealOnScrollDirective, StaggerChildrenDirective, SplitLettersDirective],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {

}
