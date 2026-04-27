import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { FIGMA_ASSETS } from './figma-assets';
import { ContentService } from './services/content.service';
import { ProgressService } from './services/progress.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell" [class.app-shell--ready]="content.ready()">
      <header class="topbar">
        <a routerLink="/" class="brand">
          <span class="brand__mark">
            <img [src]="assets.ornamentVertical" alt="">
          </span>
          <div>
            <strong>Пока все вместе</strong>
            <div class="brand__meta">Образовательная игровая платформа</div>
          </div>
        </a>

        <nav class="topbar__nav">
          <a routerLink="/modules/module_1" routerLinkActive="is-active">Литература</a>
          <a routerLink="/modules/module_2" routerLinkActive="is-active">Мастер класс</a>
          <a routerLink="/modules/module_4" routerLinkActive="is-active">Кухня</a>
          <a routerLink="/modules/module_3" routerLinkActive="is-active">Интеллектуальный</a>
          <a routerLink="/rewards" routerLinkActive="is-active">О нас</a>
        </nav>
      </header>

      <main class="app-main">
        <section class="loading-card" *ngIf="isLoading(); else readyBlock">
          <h1>Загрузка истории</h1>
          <p>Собираем сюжет, модули и дизайн-ассеты из Figma.</p>
        </section>

        <ng-template #readyBlock>
          <router-outlet />
        </ng-template>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100dvh;
    }

    .app-shell {
      min-height: 100dvh;
      background: #111;
      color: #fff;
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1rem 1.25rem;
      position: sticky;
      top: 0;
      z-index: 10;
      background: rgba(16, 28, 46, 0.25);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      color: inherit;
      text-decoration: none;
    }

    .brand__mark {
      width: 3rem;
      height: 3rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
      overflow: hidden;
    }

    .brand__mark img {
      width: 1.25rem;
      height: 1.25rem;
      object-fit: contain;
    }

    .brand__meta {
      color: rgba(255, 255, 255, 0.75);
      font-size: 0.875rem;
    }

    .topbar__nav {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .topbar__nav a {
      text-decoration: none;
      color: #fff;
      padding: 0.75rem 1rem;
      border-radius: 999px;
      font-weight: 600;
      background: rgba(236, 241, 250, 0.35);
    }

    .topbar__nav a.is-active,
    .topbar__nav a:hover {
      background: rgba(255, 255, 255, 0.48);
    }

    .app-main {
      width: min(100%, 1920px);
      margin: 0 auto;
      padding: 0;
    }

    .loading-card {
      margin: 1rem;
      padding: 2rem;
      border-radius: 2rem;
      background: rgba(255, 252, 247, 0.8);
      color: #533629;
      border: 1px solid rgba(138, 90, 60, 0.15);
      box-shadow: 0 18px 44px rgba(90, 58, 41, 0.08);
    }

    @media (max-width: 900px) {
      .topbar {
        align-items: flex-start;
        flex-direction: column;
      }
    }
  `]
})
export class AppComponent {
  readonly assets = FIGMA_ASSETS;
  readonly content = inject(ContentService);
  readonly progress = inject(ProgressService);
  readonly isLoading = computed(() => !this.content.ready());

  constructor() {
    void this.content.load();
  }
}
