import { Component } from '@angular/core';
import { ProjectItem } from '../../core/interfaces/project-item';
import { ProjectCardComponent } from "./project-card/project-card.component";

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ProjectCardComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  projects: ProjectItem[] = [
    {
      title: 'Portfolio Website',
      description: 'Angular, SCSS, responsive layout, i18n.',
      image: '/assets/images/projects/portfolio-image.png',
      tech: ['Angular', 'SCSS', 'i18n'],
      github: 'https://github.com/mohd-3384/portfolio.git',
      live: 'https://yourdomain.de',
    },
    {
      title: 'REST API Dashboard',
      description: 'Charts, filtering, auth, Material components.',
      image: 'assets/images/projects/join.png',
      tech: ['Angular', 'RxJS', 'Material'],
      github: 'https://github.com/mohd-3384/join.git',
      live: 'https://dashboard.yourdomain.dev',
    },
    {
      title: 'Task Manager',
      description: 'Kanban board with drag & drop and Firebase.',
      image: 'assets/images/projects/my-tasks.png',
      tech: ['Angular', 'Firebase', 'DnD'],
      github: 'https://github.com/mohd-3384/myTasks.git',
      live: 'https://mytasks-project.firebaseapp.com/',
    },
    {
      title: 'Game',
      description: 'Charts, filtering, auth, Material components.',
      image: 'assets/images/projects/el-pollo-loco.png',
      tech: ['JavaScript', 'RxJS', 'Material'],
      github: 'https://github.com/mohd-3384/el-pollo-loco.git',
      live: 'https://dashboard.yourdomain.dev',
    },
  ];
}
