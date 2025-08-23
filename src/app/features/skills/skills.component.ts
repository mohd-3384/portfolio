import { Component } from '@angular/core';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { StaggerChildrenDirective } from '../../shared/directives/stagger-children.directive';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [RevealOnScrollDirective, StaggerChildrenDirective],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent {
  skills = [
    { name: 'Angular', icon: '/assets/images/skills/angular.svg', color: '#dd0031' },
    { name: 'React', icon: '/assets/images/skills/react.svg', color: '#61dafb' },
    { name: 'TypeScript', icon: '/assets/images/skills/typescript.svg', color: '#3178c6' },
    { name: 'JavaScript', icon: '/assets/images/skills/javascript.svg', color: '#f7df1e' },
    { name: 'HTML', icon: '/assets/images/skills/html.svg', color: '#e34f26' },
    { name: 'CSS', icon: '/assets/images/skills/css.svg', color: '#264de4' },
    { name: 'SCSS', icon: '/assets/images/skills/scss.svg', color: '#cb6699' },
    { name: 'REST-API', icon: '/assets/images/skills/api.svg', color: '#00bfa5' },
    { name: 'Firebase', icon: '/assets/images/skills/firebase.svg', color: '#ffca28' },
    { name: 'Git', icon: '/assets/images/skills/git.svg', color: '#f05032' },
    { name: 'Scrum', icon: '/assets/images/skills/scrum.svg', color: '#36a2eb' },
    { name: 'Material design', icon: '/assets/images/skills/material-design.svg', color: '#009688' },
    { name: 'Bootstrap', icon: '/assets/images/skills/bootstrap.svg', color: '#6610f2' },
    { name: 'React Bootstrap', icon: '/assets/images/skills/react-bootstrap.svg', color: '#41e0ff' },
    { name: 'Tailwind CSS', icon: '/assets/images/skills/tailwindcss.svg', color: '#38bdf8' },
    { name: 'Figma', icon: '/assets/images/skills/figma.svg', color: '#f24e1e' },
    { name: 'SQL', icon: '/assets/images/skills/sql.svg', color: '#336791' },
    { name: 'PostgreSQL', icon: '/assets/images/skills/postgresql.svg', color: '#336791' },
    { name: 'MySQL', icon: '/assets/images/skills/mysql.svg', color: '#00618a' },
  ];
}
