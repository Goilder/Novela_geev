import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgressBannerComponent } from '../shared/components/progress-banner.component';
import { ContentService } from '../core/services/content.service';
import { ProgressService } from '../core/services/progress.service';

@Component({
  selector: 'app-awards-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ProgressBannerComponent],
  template: `
    @if (content(); as gameContent) {
      <main class="page-shell page-shell--awards">
        <app-progress-banner
          eyebrow="Награды"
          title="Искры и бейджи семьи"
          subtitle="Каждый модуль оставляет след: искры за шаги и бейдж за общее достижение."
          [sparks]="progressService.state().sparks"
        />

        <section class="content-grid content-grid--awards">
          <article class="story-card story-card--soft">
            <p class="eyebrow">Общий счет</p>
            <h2>{{ progressService.state().sparks }} искр собрано</h2>
            <div class="stat-grid">
              @for (module of modules(); track module.id) {
                <div class="stat-tile">
                  <strong>{{ progressService.isModuleCompleted(module.id) ? 'Да' : 'Нет' }}</strong>
                  <span>{{ module.title }}</span>
                </div>
              }
            </div>
          </article>

          <article class="story-card story-card--soft">
            <p class="eyebrow">Коллекция</p>
            <h2>Открытые бейджи</h2>
            <div class="badge-grid">
              @for (award of gameContent.awards; track award.id) {
                <div class="badge-card" [class.is-locked]="!hasBadge(award.id)">
                  <div class="badge-card__icon">{{ award.icon }}</div>
                  <strong>{{ award.title }}</strong>
                  <p>{{ award.description }}</p>
                  <span class="status-chip" [class.status-chip--muted]="!hasBadge(award.id)">
                    {{ hasBadge(award.id) ? 'Получен' : 'Ждет открытия' }}
                  </span>
                </div>
              }
            </div>
          </article>
        </section>

        <section class="content-grid content-grid--awards">
          <article class="story-card story-card--soft">
            <p class="eyebrow">Обратная связь</p>
            <h2>Как устроена семейная галерея</h2>
            <div class="clue-list">
              <div class="clue-item clue-item--static">
                <span>{{ gameContent.meta.feedbackModel.uploadDescription }}</span>
              </div>
              <div class="clue-item clue-item--static">
                <span>{{ gameContent.meta.feedbackModel.familyGalleryDescription }}</span>
              </div>
              <div class="clue-item clue-item--static">
                <span>{{ gameContent.meta.feedbackModel.certificateRequirement }}</span>
              </div>
            </div>
          </article>

          <article class="story-card story-card--soft">
            <p class="eyebrow">Выставка семьи</p>
            <h2>Сохраненные работы</h2>
            @if (galleryEntries().length) {
              <div class="photo-gallery">
                @for (entry of galleryEntries(); track entry.photoDataUrl) {
                  <figure class="gallery-card">
                    <img [src]="entry.photoDataUrl" alt="Семейная работа" />
                    @if (entry.caption) {
                      <figcaption>{{ entry.caption }}</figcaption>
                    }
                  </figure>
                }
              </div>
            } @else {
              <p>Здесь появятся ваши рисунки, обереги и фото блюд после творческих модулей.</p>
            }
          </article>
        </section>

        <div class="button-row">
          <a class="btn btn--ghost" routerLink="/map">Вернуться к карте</a>
          @if (allCompleted()) {
            <a class="btn btn--primary" routerLink="/final">Открыть финальный экран</a>
          }
        </div>
      </main>
    }
  `,
})
export class AwardsPageComponent {
  private readonly contentService = inject(ContentService);
  protected readonly progressService = inject(ProgressService);

  protected readonly content = this.contentService.content;
  protected readonly modules = computed(() => this.contentService.modules());
  protected readonly allCompleted = computed(() =>
    this.progressService.areAllModulesCompleted(this.modules()),
  );
  protected readonly galleryEntries = computed(() =>
    this.progressService.getPhotoGalleryEntries(),
  );

  hasBadge(badgeId: string): boolean {
    return this.progressService.state().badges.includes(badgeId);
  }
}
