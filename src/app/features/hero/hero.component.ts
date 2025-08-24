import { Component } from '@angular/core';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { StaggerChildrenDirective } from '../../shared/directives/stagger-children.directive';
import { SplitLettersDirective } from '../../shared/directives/split-letters.directive';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RevealOnScrollDirective, SplitLettersDirective, TranslateModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {

}
