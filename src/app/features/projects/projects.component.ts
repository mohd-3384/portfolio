import { Component } from '@angular/core';
import { ProjectItem } from '../../core/interfaces/project-item';
import { ProjectCardComponent } from "./project-card/project-card.component";
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { StaggerChildrenDirective } from '../../shared/directives/stagger-children.directive';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ProjectCardComponent, RevealOnScrollDirective, StaggerChildrenDirective, TranslateModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  projects: ProjectItem[] = [
    {
      title: 'Join',
      description:
        'Join ist ein kollaboratives Kanban-Board für Aufgabenverwaltung. Aufgaben lassen sich per Drag-and-Drop organisieren, filtern und durchsuchen; Kommentare und Status helfen beim Team-Workflow. Firebase sorgt für Authentifizierung und Echtzeit-Synchronisierung, sodass Änderungen sofort auf allen Geräten sichtbar sind. Das responsive UI ist auf schnelle, klare Bedienung ausgelegt.',
      image: '/assets/images/projects/join.png',
      tech: ['JavaScript', 'HTML', 'CSS', 'Firebase'],
      github: 'https://github.com/mohd-3384/join.git',
      live: 'https://dashboard.yourdomain.dev'
    },
    {
      title: 'El Pollo Loco',
      description:
        'El Pollo Loco ist ein 2D-Jump-and-Run-Browsergame. Du sammelst Coins und Salsa-Flaschen, weichst Gegnern aus, besiegst Chickens durch Sprünge und schließlich den Endboss mit Flaschenwürfen. Das Spiel ist in Vanilla JavaScript mit objektorientierter Struktur umgesetzt; Animation-Loop, Kollisionsabfragen und Sprite-Handling sorgen für flüssiges Gameplay. Das Interface ist responsiv und zeigt Health, Coins und Bottles in Statusleisten.',
      image: '/assets/images/projects/el-pollo-loco.png',
      tech: ['JavaScript', 'HTML', 'CSS'],
      github: 'https://github.com/mohd-3384/el-pollo-loco.git',
      live: 'https://dashboard.yourdomain.dev',
    },
    {
      title: "Pokédex",
      description: "Pokédex ist eine Web-App, die Pokémon-Daten aus der PokeAPI lädt. Du kannst Pokémon durchsuchen und filtern; Karten zeigen Bild, Typen und ID. Ein Overlay mit Tabs (Main, Stats, Evo Chain) liefert Details wie Größe, Gewicht, Fähigkeiten und Werte. Das UI ist responsiv und mit Bootstrap umgesetzt; „Load more“ lädt weitere Einträge.",
      image: "/assets/images/projects/pokedex.png",
      tech: ["JavaScript", "HTML", "CSS", "Bootstrap", "PokeAPI"],
      github: 'https://github.com/mohd-3384/pokedex.git',
      live: 'https://dashboard.yourdomain.dev',
    }
  ];
}
