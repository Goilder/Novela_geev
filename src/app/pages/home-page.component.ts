import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ContentService } from '../services/content.service';
import { ProgressService } from '../services/progress.service';

@Component({
  standalone: true,
  selector: 'app-home-page',
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero" *ngIf="content.content() as game">
      <div class="hero__story">
        <span class="eyebrow">Семейная визуальная новелла</span>
        <h1>{{ game.project.title }}</h1>
        <p class="lead">{{ game.general_story.logline }}</p>

        <div class="panel">
          <h2>Пампалче приглашает в путь</h2>
          <p *ngFor="let line of game.pampalche_lines.greeting">{{ line }}</p>
        </div>

        <div class="hero__actions">
          <button class="primary-btn" type="button" (click)="startJourney()">
            {{ game.ui_texts.buttons.start }}
          </button>
          <button class="secondary-btn" type="button" (click)="continueJourney()">
            {{ game.ui_texts.buttons.continue }}
          </button>
          <a class="ghost-btn" routerLink="/rewards">Посмотреть награды</a>
        </div>
      </div>

      <aside class="hero__guide">
        <div class="guide-card">
          <div class="guide-card__badge">Пампалче</div>
          <div class="guide-card__portrait">
            <div class="guide-card__halo"></div>
            <div class="guide-card__figure">
              <span>Проводник</span>
              <strong>семейного круга</strong>
            </div>
          </div>
          <ul>
            <li>4 модуля</li>
            <li>совместные задания</li>
            <li>кроссворд и творчество</li>
            <li>финальный сертификат семьи</li>
          </ul>
        </div>
      </aside>
    </section>
  `,
  styles: [`
    .hero {
      display: grid;
      grid-template-columns: 1.5fr 0.95fr;
      gap: 1.5rem;
      align-items: start;
    }

    .eyebrow {
      display: inline-flex;
      padding: 0.45rem 0.8rem;
      border-radius: 999px;
      background: rgba(141, 61, 58, 0.1);
      color: #8d3d3a;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    h1 {
      font-size: clamp(2.2rem, 3vw, 4rem);
      line-height: 1.02;
      margin: 0 0 1rem;
    }

    .lead {
      font-size: 1.15rem;
      line-height: 1.7;
      margin-bottom: 1.5rem;
      max-width: 56rem;
    }

    .panel,
    .guide-card {
      border-radius: 2rem;
      padding: 1.5rem;
      background: rgba(255, 250, 242, 0.8);
      border: 1px solid rgba(138, 90, 60, 0.14);
      box-shadow: 0 18px 44px rgba(90, 58, 41, 0.08);
    }

    .panel p {
      margin-bottom: 0.85rem;
      line-height: 1.7;
    }

    .hero__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    .primary-btn,
    .secondary-btn,
    .ghost-btn {
      min-height: 3.25rem;
      padding: 0.85rem 1.3rem;
      border-radius: 999px;
      font: inherit;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      border: none;
    }

    .primary-btn {
      background: linear-gradient(135deg, #c86d4a, #b6453a);
      color: #fffaf6;
    }

    .secondary-btn {
      background: #718c5a;
      color: #fffdf8;
    }

    .ghost-btn {
      background: rgba(113, 140, 90, 0.12);
      color: #5c6d48;
      display: inline-flex;
      align-items: center;
    }

    .guide-card__badge {
      display: inline-flex;
      padding: 0.4rem 0.7rem;
      border-radius: 999px;
      background: rgba(221, 228, 242, 0.75);
      color: #536070;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .guide-card__portrait {
      position: relative;
      min-height: 21rem;
      border-radius: 1.8rem;
      background:
        radial-gradient(circle at center, rgba(221, 228, 242, 0.95), rgba(221, 228, 242, 0) 55%),
        linear-gradient(180deg, #d6b98b 0%, #f7f1e3 100%);
      overflow: hidden;
      margin-bottom: 1rem;
    }

    .guide-card__halo {
      position: absolute;
      inset: auto 18% 14% 18%;
      height: 9rem;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(242, 232, 201, 0.95), rgba(242, 232, 201, 0));
    }

    .guide-card__figure {
      position: absolute;
      inset: auto 10% 10% 10%;
      min-height: 14rem;
      border-radius: 40% 40% 22% 22%;
      background:
        linear-gradient(180deg, #f7f1e3 0 18%, #8a5a3c 18% 24%, #c86d4a 24% 80%, #8d3d3a 80% 100%);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      color: #fff8f2;
      padding-bottom: 1.2rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .guide-card ul {
      margin: 0;
      padding-left: 1.2rem;
      line-height: 1.8;
    }

    @media (max-width: 900px) {
      .hero {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomePageComponent {
  readonly content = inject(ContentService);
  readonly progress = inject(ProgressService);
  private readonly router = inject(Router);

  readonly nextRoute = computed(() => {
    const active = this.progress.progress().activeModuleId;
    return active ? ['/modules', active] : ['/map'];
  });

  startJourney(): void {
    this.router.navigateByUrl('/map');
  }

  continueJourney(): void {
    void this.router.navigate(this.nextRoute());
  }
}
