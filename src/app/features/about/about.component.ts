import { Component } from '@angular/core';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RevealOnScrollDirective, TranslateModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

}
