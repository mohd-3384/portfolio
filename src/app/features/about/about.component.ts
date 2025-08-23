import { Component } from '@angular/core';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';


@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RevealOnScrollDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

}
