import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { SafeResourceUrlPipe } from '../pipes/safe-resource-url.pipe';
import { VideoStep } from '../../core/models/game-content.model';

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [CommonModule, SafeResourceUrlPipe],
  template: `
    <article class="step-card story-card">
      <div class="step-card__body">
        <p class="eyebrow">Видео / инструкция</p>
        <h2>{{ step().title }}</h2>
        <p class="lede">{{ step().prompt }}</p>

        <div class="media-frame">
          @if (step().videoEmbedUrl) {
            <iframe
              [src]="step().videoEmbedUrl | safeResourceUrl"
              title="Видео модуля"
              allowfullscreen
            ></iframe>
          } @else if (step().videoUrl) {
            <video controls [poster]="step().posterAsset">
              <source [src]="step().videoUrl" />
            </video>
          } @else if (step().posterAsset) {
            <img [src]="step().posterAsset" [alt]="step().title" />
          } @else {
            <div class="media-frame__placeholder">Сюда можно подключить видео или локальную инструкцию.</div>
          }
        </div>

        @if (step().tips?.length) {
          <div class="tip-list">
            @for (tip of step().tips ?? []; track tip) {
              <div class="tip-pill">{{ tip }}</div>
            }
          </div>
        }

        <button class="btn btn--primary" type="button" (click)="completed.emit()">
          {{ step().continueLabel || 'Продолжить' }}
        </button>
      </div>
    </article>
  `,
})
export class VideoCardComponent {
  readonly step = input.required<VideoStep>();
  readonly completed = output<void>();
}
