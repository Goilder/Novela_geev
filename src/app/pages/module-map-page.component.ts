import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContentService } from '../services/content.service';
import { ProgressService } from '../services/progress.service';

@Component({
  standalone: true,
  selector: 'app-module-map-page',
  imports: [CommonModule, RouterLink],
  template: `
    <section class="map-page" *ngIf="content.content() as game">
      <div class="map-page__intro card">
        <span class="eyebrow">Карта путешествия</span>
        <h1>Семейный путь из четырех искр</h1>
        <p>{{ game.general_story.premise }}</p>
      </div>

      <div class="map-grid">
        <article class="module-card"
          *ngFor="let module of game.modules; let i = index"
          [class.module-card--locked]="!progress.isModuleUnlocked(module.id)"
          [class.module-card--done]="progress.isModuleCompleted(module.id)">
          <div class="module-card__index">0{{ i + 1 }}</div>
          <h2>{{ module.title }}</h2>
          <p>{{ module.subtitle }}</p>

          <div class="module-card__status">
            <span *ngIf="progress.isModuleCompleted(module.id)">Пройден</span>
            <span *ngIf="!progress.isModuleCompleted(module.id) && progress.isModuleUnlocked(module.id)">Открыт</span>
            <span *ngIf="!progress.isModuleUnlocked(module.id)">Закрыт</span>
          </div>

          <a
            *ngIf="progress.isModuleUnlocked(module.id); else lockedState"
            class="module-card__cta"
            [routerLink]="['/modules', module.id]">
            Открыть модуль
          </a>

          <ng-template #lockedState>
            <div class="module-card__cta module-card__cta--locked">
              Сначала завершите предыдущий модуль
            </div>
          </ng-template>
        </article>
      </div>
    </section>
  `,
  styles: [`
    .map-page {
      display: grid;
      gap: 1.25rem;
    }

    .card {
      padding: 1.5rem;
      border-radius: 2rem;
      background: rgba(255, 251, 244, 0.84);
      border: 1px solid rgba(138, 90, 60, 0.14);
      box-shadow: 0 18px 44px rgba(90, 58, 41, 0.08);
    }

    .eyebrow {
      display: inline-flex;
      padding: 0.45rem 0.8rem;
      border-radius: 999px;
      background: rgba(199, 217, 183, 0.52);
      color: #557043;
      font-weight: 700;
      margin-bottom: 0.9rem;
    }

    .map-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
    }

    .module-card {
      position: relative;
      display: grid;
      gap: 0.9rem;
      padding: 1.4rem;
      min-height: 16rem;
      border-radius: 2rem;
      background:
        linear-gradient(180deg, rgba(255, 251, 244, 0.96), rgba(245, 236, 219, 0.86)),
        #fff;
      border: 1px solid rgba(138, 90, 60, 0.16);
      box-shadow: 0 18px 40px rgba(90, 58, 41, 0.08);
    }

    .module-card--done {
      border-color: rgba(113, 140, 90, 0.36);
      box-shadow: 0 20px 42px rgba(113, 140, 90, 0.14);
    }

    .module-card--locked {
      opacity: 0.76;
    }

    .module-card__index {
      width: 3rem;
      height: 3rem;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: rgba(182, 69, 58, 0.12);
      color: #8d3d3a;
      font-weight: 800;
    }

    .module-card__status {
      color: #6b5a4f;
      font-weight: 700;
    }

    .module-card__cta {
      margin-top: auto;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      min-height: 3rem;
      border-radius: 999px;
      background: linear-gradient(135deg, #718c5a, #8fa676);
      color: #fffcf8;
      text-decoration: none;
      font-weight: 700;
      padding: 0.75rem 1rem;
    }

    .module-card__cta--locked {
      background: rgba(138, 90, 60, 0.08);
      color: #8a5a3c;
    }

    @media (max-width: 860px) {
      .map-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ModuleMapPageComponent {
  readonly content = inject(ContentService);
  readonly progress = inject(ProgressService);
}
