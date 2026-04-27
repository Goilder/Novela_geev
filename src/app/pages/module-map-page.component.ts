import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FIGMA_ASSETS } from '../figma-assets';
import { ContentService } from '../services/content.service';
import { ProgressService } from '../services/progress.service';

@Component({
  standalone: true,
  selector: 'app-module-map-page',
  imports: [CommonModule, RouterLink],
  template: `
    <section class="map-page" *ngIf="content.content() as game" [style.background-image]="'url(' + assets.mapPath + ')'">
      <div class="map-page__veil"></div>
      <div class="map-grid">
        <article class="module-card"
          *ngFor="let module of game.modules; let i = index"
          [class.module-card--locked]="!progress.isModuleUnlocked(module.id)"
          [class.module-card--done]="progress.isModuleCompleted(module.id)">
          <div class="module-card__index">{{ i + 1 }}</div>
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
      min-height: calc(100dvh - 80px);
      position: relative;
      background-position: center;
      background-size: cover;
      overflow: hidden;
      padding: 3rem 2rem;
    }

    .map-page__veil {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02));
    }

    .map-grid {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1.25rem;
      max-width: 78rem;
      margin-left: auto;
    }

    .module-card {
      position: relative;
      display: grid;
      gap: 0.9rem;
      padding: 1.4rem;
      min-height: 16rem;
      border-radius: 2rem;
      background: rgba(198, 221, 77, 0.64);
      backdrop-filter: blur(12px);
      border: 2px solid rgba(255, 255, 255, 0.72);
      box-shadow: 0 22px 52px rgba(0, 0, 0, 0.18);
    }

    .module-card--done {
      box-shadow: 0 20px 42px rgba(113, 140, 90, 0.24);
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
      background: rgba(255, 255, 255, 0.88);
      color: #294000;
      font-weight: 800;
    }

    .module-card h2,
    .module-card p,
    .module-card__status {
      color: #173100;
    }

    .module-card__status {
      font-weight: 700;
    }

    .module-card__cta {
      margin-top: auto;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      min-height: 3rem;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.24);
      color: #fffcf8;
      text-decoration: none;
      font-weight: 700;
      padding: 0.75rem 1rem;
      border: 1px solid rgba(255, 255, 255, 0.75);
    }

    .module-card__cta--locked {
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
    }

    @media (max-width: 860px) {
      .map-page {
        padding: 1rem;
      }

      .map-grid {
        grid-template-columns: 1fr;
        margin-left: 0;
      }
    }
  `]
})
export class ModuleMapPageComponent {
  readonly assets = FIGMA_ASSETS;
  readonly content = inject(ContentService);
  readonly progress = inject(ProgressService);
}
