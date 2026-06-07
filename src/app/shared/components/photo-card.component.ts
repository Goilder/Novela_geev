import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PhotoStep } from '../../core/models/game-content.model';

interface PhotoAnswer {
  photoDataUrl: string;
  caption: string;
}

@Component({
  selector: 'app-photo-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <article class="step-card story-card">
      @if (step().illustrationAsset) {
        <div class="scene-cover">
          <img [src]="step().illustrationAsset" [alt]="step().title" />
        </div>
      }
      <div class="step-card__body">
        <p class="eyebrow">Фото семьи</p>
        <h2>{{ step().title }}</h2>
        <p class="lede">{{ step().prompt }}</p>

        <div class="photo-dropzone">
          @if (previewUrl()) {
            <img [src]="previewUrl()" [alt]="step().title" />
          } @else {
            <div class="photo-dropzone__placeholder">
              <strong>Здесь появится ваш снимок</strong>
              <p>Фото сохраняется локально в браузере для этого MVP.</p>
            </div>
          }
        </div>

        <input #fileInput type="file" accept="image/*" hidden (change)="onFileSelected($event)" />

        <div class="photo-actions">
          <button class="btn btn--ghost" type="button" (click)="fileInput.click()">Выбрать фото</button>
          @if (previewUrl()) {
            <button class="btn btn--ghost" type="button" (click)="clearPhoto()">Удалить</button>
          }
        </div>

        <label class="form-field">
          <span>{{ step().captionLabel }}</span>
          <textarea
            rows="2"
            [placeholder]="step().captionPlaceholder"
            [ngModel]="caption()"
            (ngModelChange)="caption.set($event)"
          ></textarea>
        </label>

        <button class="btn btn--primary" type="button" [disabled]="!previewUrl()" (click)="confirm()">
          {{ step().continueLabel || 'Продолжить' }}
        </button>
      </div>
    </article>
  `,
})
export class PhotoCardComponent {
  @ViewChild('fileInput') fileInputRef?: ElementRef<HTMLInputElement>;

  readonly step = input.required<PhotoStep>();
  readonly savedAnswer = input<PhotoAnswer | null>(null);
  readonly completed = output<PhotoAnswer>();

  readonly previewUrl = signal('');
  readonly caption = signal('');

  constructor() {
    effect(() => {
      const savedAnswer = this.savedAnswer();
      this.previewUrl.set(savedAnswer?.photoDataUrl ?? '');
      this.caption.set(savedAnswer?.caption ?? '');
    });
  }

  async onFileSelected(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }

    this.previewUrl.set(await this.resizeImage(file));
  }

  clearPhoto(): void {
    this.previewUrl.set('');
    this.caption.set('');
    if (this.fileInputRef?.nativeElement) {
      this.fileInputRef.nativeElement.value = '';
    }
  }

  confirm(): void {
    if (!this.previewUrl()) {
      return;
    }

    this.completed.emit({
      photoDataUrl: this.previewUrl(),
      caption: this.caption(),
    });
  }

  private resizeImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          const maxWidth = 1280;
          const scale = Math.min(1, maxWidth / image.width);
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(image.width * scale);
          canvas.height = Math.round(image.height * scale);
          const context = canvas.getContext('2d');

          if (!context) {
            reject(new Error('Canvas is not supported.'));
            return;
          }

          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.86));
        };
        image.onerror = reject;
        image.src = reader.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
