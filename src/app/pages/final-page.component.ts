import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgressBannerComponent } from '../shared/components/progress-banner.component';
import { ContentService } from '../core/services/content.service';
import { ProgressService } from '../core/services/progress.service';

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

            <div class="button-row">
              <button class="btn btn--primary" type="button" (click)="printCertificate()">Распечатать сертификат</button>
              <a class="btn btn--ghost" routerLink="/awards">Назад к наградам</a>
            </div>
          </article>

          <article class="story-card story-card--soft">
            <p class="eyebrow">Память о путешествии</p>
            <h2>Семейные фото</h2>
            @if (photos().length) {
              <div class="photo-gallery">
                @for (photo of photos(); track photo) {
                  <img [src]="photo" alt="Семейный результат" />
                }
              </div>
            } @else {
              <p>Фото появятся здесь, если вы загрузили их в модулях.</p>
            }

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
  protected readonly photos = computed(() => this.progressService.getModulePhotoEntries());
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
