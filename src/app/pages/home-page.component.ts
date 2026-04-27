import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import { FIGMA_ASSETS } from '../figma-assets';
import { ContentService } from '../services/content.service';
import { ProgressService } from '../services/progress.service';

@Component({
  standalone: true,
  selector: 'app-home-page',
  imports: [CommonModule],
  template: `
    <section class="hero" *ngIf="content.content() as game" [style.background-image]="'url(' + assets.homeHero + ')'">
      <div class="hero__overlay">
        <div class="hero__story">
          <h1>{{ game.project.title }}</h1>
          <div class="hero__region">Республика Марий Эл</div>
          <p class="lead">
            Сказка повествует о смелой девочке по имени Сереброзубая Пампалче.
            Её жизнь захватывающая и интересная. Сегодня вы с ней познакомитесь через образовательную игру.
          </p>

          <div class="hero__actions">
            <button class="primary-btn" type="button" (click)="startJourney()">Начать игру</button>
            <button class="secondary-btn" type="button" (click)="continueJourney()">
              {{ game.ui_texts.buttons.continue }}
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      min-height: calc(100dvh - 80px);
      background-position: center;
      background-size: cover;
      position: relative;
      display: flex;
      align-items: stretch;
    }

    .hero__overlay {
      width: 100%;
      background: linear-gradient(90deg, rgba(110, 122, 95, 0.74) 0%, rgba(125, 135, 111, 0.5) 42%, rgba(0, 0, 0, 0) 60%);
      display: flex;
      align-items: center;
    }

    .hero__story {
      width: min(48rem, 100%);
      padding: 5rem 2rem 4rem 6rem;
      color: #fff;
    }

    h1 {
      font-size: clamp(3rem, 7vw, 6rem);
      line-height: 0.98;
      margin: 0 0 1.25rem;
      letter-spacing: -0.03em;
    }

    .hero__region {
      font-size: clamp(1.3rem, 2.4vw, 2.2rem);
      margin-bottom: 1.75rem;
    }

    .lead {
      font-size: clamp(1.05rem, 1.8vw, 1.45rem);
      line-height: 1.45;
      max-width: 36rem;
    }

    .hero__actions {
      display: flex;
      gap: 0.9rem;
      flex-wrap: wrap;
      margin-top: 2rem;
    }

    .primary-btn,
    .secondary-btn {
      min-height: 3.25rem;
      padding: 0.9rem 1.4rem;
      border-radius: 1rem;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
      border: none;
      font-size: 1.15rem;
    }

    .primary-btn {
      background: #c93232;
      color: #fffaf6;
    }

    .secondary-btn {
      background: rgba(255, 255, 255, 0.2);
      color: #fffdf8;
      border: 1px solid rgba(255, 255, 255, 0.28);
      backdrop-filter: blur(10px);
    }

    @media (max-width: 900px) {
      .hero__overlay {
        background: linear-gradient(180deg, rgba(110, 122, 95, 0.78) 0%, rgba(110, 122, 95, 0.62) 45%, rgba(110, 122, 95, 0.2) 100%);
      }

      .hero__story {
        padding: 2rem 1rem 2rem;
      }
    }
  `]
})
export class HomePageComponent {
  readonly assets = FIGMA_ASSETS;
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
