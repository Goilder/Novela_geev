import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/services/content.service';
import { ProgressService } from '../core/services/progress.service';
import { ProgressBannerComponent } from '../shared/components/progress-banner.component';

@Component({
  selector: 'app-final-page',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, ProgressBannerComponent],
  template: `
    @if (content(); as gameContent) {
      <main class="page-shell page-shell--final">
        <app-progress-banner
          eyebrow="Финал"
          [title]="gameContent.finale.title"
          [subtitle]="gameContent.finale.subtitle"
          [sparks]="progressService.state().sparks"
        />

        <section class="content-grid content-grid--final">
          <article class="story-card certificate-sheet">
            <p class="eyebrow">{{ gameContent.finale.certificateTitle }}</p>
            <h2>{{ familyTitle() }}</h2>
            <p>{{ gameContent.finale.certificateLine }}</p>

            <div class="certificate-sheet__meta">
              <div>
                <span>Ребенок</span>
                <strong>{{ childName() }}</strong>
              </div>
              <div>
                <span>Родитель</span>
                <strong>{{ parentName() }}</strong>
              </div>
              <div>
                <span>Дата</span>
                <strong>{{ today | date: 'dd.MM.yyyy' }}</strong>
              </div>
            </div>

            <div class="tip-list">
              @for (line of gameContent.finale.closingLines; track line) {
                <div class="tip-pill">{{ line }}</div>
              }
            </div>

            <div class="clue-list">
              @for (requirement of gameContent.finale.requirements; track requirement) {
                <div class="clue-item clue-item--static">
                  <span>{{ requirement }}</span>
                </div>
              }
            </div>

            <div class="button-row">
              <button class="btn btn--primary" type="button" (click)="printCertificate()">
                Распечатать сертификат
              </button>
              <a class="btn btn--ghost" routerLink="/awards">Назад к наградам</a>
            </div>
          </article>

          <article class="story-card story-card--soft">
            <p class="eyebrow">Память о путешествии</p>
            <h2>Семейные фото</h2>
            @if (galleryEntries().length) {
              <div class="photo-gallery">
                @for (entry of galleryEntries(); track entry.photoDataUrl) {
                  <figure class="gallery-card">
                    <img [src]="entry.photoDataUrl" alt="Семейный результат" />
                    @if (entry.caption) {
                      <figcaption>{{ entry.caption }}</figcaption>
                    }
                  </figure>
                }
              </div>
            } @else {
              <p>Фото появятся здесь, если вы загрузили их в модулях.</p>
            }

            <h3>Как выдается сертификат</h3>
            <div class="clue-list">
              @for (line of gameContent.finale.issueScenario; track line) {
                <div class="clue-item clue-item--static">
                  <span>{{ line }}</span>
                </div>
              }
            </div>

            <h3>Пройденные модули</h3>
            <div class="tip-list">
              @for (module of modules(); track module.id) {
                <div class="tip-pill">{{ module.order }}. {{ module.title }}</div>
              }
            </div>
          </article>
        </section>
      </main>
    }
  `,
})
export class FinalPageComponent {
  private readonly contentService = inject(ContentService);
  protected readonly progressService = inject(ProgressService);

  protected readonly content = this.contentService.content;
  protected readonly modules = computed(() => this.contentService.modules());
  protected readonly galleryEntries = computed(() => this.progressService.getPhotoGalleryEntries());
  protected readonly childName = computed(
    () => this.progressService.state().familyProfile.childName || 'Юный участник',
  );
  protected readonly parentName = computed(
    () => this.progressService.state().familyProfile.parentName || 'Взрослый спутник',
  );
  protected readonly familyTitle = computed(
    () => `${this.childName()} и ${this.parentName()} завершили путь вместе`,
  );
  protected readonly today = new Date();

  printCertificate(): void {
    window.print();
  }
}
