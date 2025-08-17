import { Component, Input } from '@angular/core';
import { ProjectItem } from '../../../core/interfaces/project-item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: ProjectItem;
  @Input() flip = false;
}
