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

  /**
 * Converts a given title string into a URL-friendly slug.
 *
 * - Removes accents/diacritics (e.g., "Pokédex" → "Pokedex").
 * - Trims whitespace.
 * - Converts to lowercase.
 * - Replaces non-alphanumeric characters with hyphens.
 * - Collapses multiple hyphens into one.
 * - Removes leading and trailing hyphens.
 *
 * @param {string} title - The input string to be slugified.
 * @returns {string} The slugified string.
 */
  private slugify(title: string): string {
    let s = title.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');

    return s
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  /**
 * Generates a translation key for a project card description,
 * based on the slugified version of the given title.
 *
 * @param {string} title - The project title to generate the description key for.
 * @returns {string} A translation key in the format:
 *                   `projectCard.{slugifiedTitle}.description`
 */
  descKey(title: string): string {
    return `projectCard.${this.slugify(title)}.description`;
  }
}
