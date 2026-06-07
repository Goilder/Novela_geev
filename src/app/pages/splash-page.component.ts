import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService } from '../core/services/content.service';

@Component({
  selector: 'app-splash-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="loading-screen loading-screen--immersive" aria-label="Экран загрузки">
      <div class="loading-screen__backdrop"></div>

      <section class="loading-stage">
        <img
          class="loading-stage__bg"
          src="assets/loading/loading-background.png"
          alt="Пейзаж Марий Эл"
        />

        <div class="loading-stage__content">
          <img
            class="loading-stage__hero"
            src="assets/loading/pampalche-hero.png"
            alt="Пампалче"
          />

          <article class="loading-stage__bubble">
            <h1>Привет! Я — Пампалче!</h1>
            <p>
              Приглашаю тебя в увлекательное путешествие по моей родной земле. Нас ждут
              интересные истории, традиции, задания и открытия!
            </p>
            <p class="loading-stage__question">Готов отправиться?</p>

            <button class="loading-stage__cta" type="button" [disabled]="!isReady()" (click)="start()">
              <span>{{ isReady() ? 'Отправиться в путешествие' : 'Подготавливаем игру...' }}</span>
              <span aria-hidden="true">→</span>
            </button>
          </article>

          <div class="loading-stage__progress">
            <p>{{ isReady() ? 'Все готово к путешествию' : 'Загрузка... ' + simulatedProgress() + '%' }}</p>
            <div class="loading-stage__track" aria-hidden="true">
              <span
                class="loading-stage__bar"
                [class.loading-stage__bar--ready]="isReady()"
                [style.width.%]="simulatedProgress()"
              ></span>
            </div>
          </div>
        </div>
      </section>
    </main>
  `,
})
export class SplashPageComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly contentService = inject(ContentService);
  private readonly loadingDurationMs = 5000;
  private readonly tickMs = 100;
  private startedAt = Date.now();
  private readonly timerId: number | null;

  protected readonly simulatedProgress = signal(0);
  protected readonly isReady = computed(() =>
    this.simulatedProgress() >= 100 && !this.contentService.loading() && !!this.contentService.content(),
  );

  constructor() {
    this.timerId = window.setInterval(() => {
      const elapsed = Date.now() - this.startedAt;
      const nextProgress = Math.min(100, Math.round((elapsed / this.loadingDurationMs) * 100));
      this.simulatedProgress.set(nextProgress);

      if (nextProgress >= 100 && this.timerId !== null) {
        window.clearInterval(this.timerId);
      }
    }, this.tickMs);
  }

  start(): void {
    if (!this.isReady()) {
      return;
    }

    void this.router.navigate(['/menu']);
  }

  ngOnDestroy(): void {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
    }
  }
}
