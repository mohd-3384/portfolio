import { Component, Input } from '@angular/core';
import { ProjectItem } from '../../../core/interfaces/project-item';
import { CommonModule } from '@angular/common';
import { RevealOnScrollDirective } from '../../../shared/directives/reveal-on-scroll.directive';
import { TranslateModule } from '@ngx-translate/core';



@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective, TranslateModule],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: ProjectItem;
  @Input() flip = false;

  private slugify(title: string): string {
    // (Pokédex -> Pokedex)
    let s = title.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');

    return s
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  descKey(title: string): string {
    return `projectCard.${this.slugify(title)}.description`;
  }

}
