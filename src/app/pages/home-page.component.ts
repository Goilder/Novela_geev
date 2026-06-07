import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ContentService } from '../core/services/content.service';
import { ProgressService } from '../core/services/progress.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    @if (content(); as gameContent) {
      <main class="page-shell page-shell--home">
        <section class="hero-panel story-card hero-panel--home">
          <div class="hero-panel__copy">
            <p class="eyebrow">Главное меню</p>
            <h1>{{ gameContent.meta.title }}</h1>
            <p class="lede">{{ gameContent.meta.subtitle }}</p>
            <p>{{ gameContent.meta.description }}</p>

            <div class="highlight-grid">
              @for (highlight of gameContent.meta.highlights; track highlight) {
                <div class="highlight-chip">{{ highlight }}</div>
              }
            </div>

            <div class="button-row button-row--hero">
              <button class="btn btn--primary" type="button" (click)="startJourney()">
                {{ hasStarted() ? 'Продолжить путешествие' : 'Начать путешествие' }}
              </button>
              <a class="btn btn--ghost" routerLink="/map">Открыть карту модулей</a>
            </div>
          </div>

          <div class="hero-panel__media">
            <img [src]="gameContent.meta.homeBackgroundAsset" [alt]="gameContent.meta.title" />
          </div>
        </section>

        <section class="content-grid content-grid--home">
          <article class="story-card form-card story-card--soft">
            <p class="eyebrow">Семейный старт</p>
            <h2>Кто проходит путешествие</h2>
            <div class="field-stack">
              <label class="form-field">
                <span>Имя ребенка</span>
                <input
                  type="text"
                  placeholder="Например: Алина"
                  [ngModel]="childName()"
                  (ngModelChange)="childName.set($event)"
                />
              </label>

              <label class="form-field">
                <span>Имя родителя</span>
                <input
                  type="text"
                  placeholder="Например: мама Лена"
                  [ngModel]="parentName()"
                  (ngModelChange)="parentName.set($event)"
                />
              </label>
            </div>

            <div class="button-row">
              <a class="btn btn--ghost" routerLink="/map">Открыть карту</a>
            </div>
          </article>

          <article class="story-card story-card--soft">
            <p class="eyebrow">Прогресс</p>
            <h2>Что уже открыто</h2>
            <div class="stat-grid">
              <div class="stat-tile">
                <strong>{{ progressService.state().completedModuleIds.length }}/4</strong>
                <span>модуля завершено</span>
              </div>
              <div class="stat-tile">
                <strong>{{ progressService.state().sparks }}</strong>
                <span>искр собрано</span>
              </div>
              <div class="stat-tile">
                <strong>{{ progressService.state().badges.length }}</strong>
                <span>бейджей получено</span>
              </div>
            </div>

            <div class="button-row">
              <a class="btn btn--ghost" routerLink="/awards">Смотреть награды</a>
              <button class="btn btn--ghost" type="button" (click)="resetJourney()">Сбросить прогресс</button>
            </div>
          </article>
        </section>

        <section class="content-grid content-grid--home">
          <article class="story-card story-card--soft">
            <p class="eyebrow">Для кого</p>
            <h2>Целевая аудитория</h2>
            <div class="tip-list">
              @for (item of gameContent.meta.targetAudience; track item) {
                <div class="tip-pill">{{ item }}</div>
              }
            </div>

            <p class="eyebrow">Ценности</p>
            <h3>Что мы укрепляем</h3>
            <div class="highlight-grid">
              @for (value of gameContent.meta.familyValues; track value) {
                <div class="highlight-chip">{{ value }}</div>
              }
            </div>
          </article>

          <article class="story-card story-card--soft">
            <p class="eyebrow">Пампалче</p>
            <h2>{{ gameContent.meta.guideProfile.name }} — {{ gameContent.meta.guideProfile.title }}</h2>
            <p>{{ gameContent.meta.guideProfile.mission }}</p>

            <div class="highlight-grid">
              @for (trait of gameContent.meta.guideProfile.traits; track trait) {
                <div class="highlight-chip">{{ trait }}</div>
              }
            </div>
          </article>
        </section>

        <section class="content-grid content-grid--home">
          <article class="story-card story-card--soft">
            <p class="eyebrow">Основа</p>
            <h2>Образовательная концепция</h2>
            <p>{{ gameContent.meta.educationalFoundation.relevance }}</p>
            <p>{{ gameContent.meta.educationalFoundation.culturalContext }}</p>

            <div class="tip-list">
              @for (item of gameContent.meta.educationalFoundation.pedagogicalBase; track item) {
                <div class="tip-pill">{{ item }}</div>
              }
            </div>
          </article>

          <article class="story-card story-card--soft">
            <p class="eyebrow">Результат</p>
            <h2>Что семья получает после прохождения</h2>
            <div class="clue-list">
              @for (item of gameContent.meta.outcomes; track item) {
                <div class="clue-item clue-item--static">
                  <span>{{ item }}</span>
                </div>
              }
            </div>
          </article>
        </section>
      </main>
    }
  `,
})
export class HomePageComponent {
  private readonly contentService = inject(ContentService);
  private readonly router = inject(Router);

  protected readonly progressService = inject(ProgressService);
  protected readonly content = this.contentService.content;

  protected readonly childName = signal(this.progressService.state().familyProfile.childName);
  protected readonly parentName = signal(this.progressService.state().familyProfile.parentName);
  protected readonly hasStarted = computed(() => !!this.progressService.state().startedAt);

  startJourney(): void {
    this.progressService.saveFamilyProfile(this.childName(), this.parentName());
    void this.router.navigate(['/map']);
  }

  resetJourney(): void {
    if (window.confirm('Сбросить локальный прогресс путешествия?')) {
      this.progressService.reset();
      this.childName.set('');
      this.parentName.set('');
    }
  }
}
