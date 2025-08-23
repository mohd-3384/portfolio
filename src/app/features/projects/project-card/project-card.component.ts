import { Component, Input } from '@angular/core';
import { ProjectItem } from '../../../core/interfaces/project-item';
import { CommonModule } from '@angular/common';
import { RevealOnScrollDirective } from '../../../shared/directives/reveal-on-scroll.directive';



@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: ProjectItem;
  @Input() flip = false;
}
