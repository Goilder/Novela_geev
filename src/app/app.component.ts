import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

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
          <span class="brand__mark">П</span>
          <div>
            <strong>Пока все вместе</strong>
            <div class="brand__meta">Путешествие с Пампалче</div>
          </div>
        </a>

        <nav class="topbar__nav">
          <a routerLink="/map" routerLinkActive="is-active">Карта</a>
          <a routerLink="/rewards" routerLinkActive="is-active">Награды</a>
          <a routerLink="/final" routerLinkActive="is-active">Финал</a>
        </nav>
      </header>

      <main class="app-main">
        <section class="loading-card" *ngIf="isLoading(); else readyBlock">
          <h1>Загрузка истории</h1>
          <p>Собираем сюжет, модули и визуальную тему Пампалче.</p>
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
      background:
        radial-gradient(circle at top right, rgba(221, 228, 242, 0.65), transparent 30%),
        radial-gradient(circle at left bottom, rgba(199, 217, 183, 0.45), transparent 25%),
        linear-gradient(180deg, #f7f1e3 0%, #efe1c8 100%);
      color: #533629;
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
      background: rgba(247, 241, 227, 0.88);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(138, 90, 60, 0.12);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      color: inherit;
      text-decoration: none;
    }

    .brand__mark {
      width: 2.8rem;
      height: 2.8rem;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: linear-gradient(135deg, #c86d4a, #b6453a);
      color: #fff8f2;
      font-weight: 700;
      box-shadow: 0 10px 24px rgba(182, 69, 58, 0.2);
    }

    .brand__meta {
      color: #7f6a5c;
      font-size: 0.875rem;
    }

    .topbar__nav {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .topbar__nav a {
      text-decoration: none;
      color: #6d4a35;
      padding: 0.75rem 1rem;
      border-radius: 999px;
      font-weight: 600;
    }

    .topbar__nav a.is-active,
    .topbar__nav a:hover {
      background: rgba(182, 69, 58, 0.1);
      color: #8d3d3a;
    }

    .app-main {
      width: min(1180px, calc(100% - 2rem));
      margin: 0 auto;
      padding: 1.25rem 0 2rem;
    }

    .loading-card {
      padding: 2rem;
      border-radius: 2rem;
      background: rgba(255, 252, 247, 0.8);
      border: 1px solid rgba(138, 90, 60, 0.15);
      box-shadow: 0 18px 44px rgba(90, 58, 41, 0.08);
    }

    @media (max-width: 720px) {
      .topbar {
        align-items: flex-start;
        flex-direction: column;
      }

      .app-main {
        width: min(100% - 1rem, 1180px);
      }
    }
  `]
})
export class AppComponent {
  readonly content = inject(ContentService);
  readonly progress = inject(ProgressService);
  readonly isLoading = computed(() => !this.content.ready());

  constructor() {
    void this.content.load();
  }
}
