import { Component } from '@angular/core';
import { HeroComponent } from '../../features/hero/hero.component';
import { AboutComponent } from '../../features/about/about.component';
import { SkillsComponent } from '../../features/skills/skills.component';
import { ProjectsComponent } from '../../features/projects/projects.component';
import { ContactComponent } from '../../features/contact/contact.component';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, AboutComponent, SkillsComponent, ProjectsComponent, ContactComponent, TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
