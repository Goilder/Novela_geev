import { Component, effect, inject, input, output, signal } from '@angular/core';
import { QuizStep } from '../../core/models/game-content.model';
import { ContentService } from '../../core/services/content.service';

@Component({
  selector: 'app-quiz-card',
  standalone: true,
  template: `
    <article class="step-card story-card">
      @if (step().illustrationAsset) {
        <div class="scene-cover">
          <img [src]="step().illustrationAsset" [alt]="step().title" />
        </div>
      }
      <div class="step-card__body">
        <p class="eyebrow">Тест</p>
        <h2>{{ step().title }}</h2>
        <p class="lede">{{ step().prompt }}</p>

        <div class="option-grid">
          @for (option of step().options; track option.id) {
            <button
              class="option-button"
              type="button"
              [class.is-active]="selectedOptionId() === option.id"
              [disabled]="locked()"
              (click)="answer(option.id)"
            >
              {{ option.label }}
            </button>
          }
        </div>

        @if (selectedOptionId()) {
          <div
            class="feedback-panel"
            [class.feedback-panel--good]="isCorrect()"
            [class.feedback-panel--soft]="!isCorrect()"
          >
            <strong>{{ isCorrect() ? 'Верно!' : 'Подумаем еще' }}</strong>
            <p>{{ isCorrect() ? step().feedback.correct : step().feedback.incorrect }}</p>
            @if (pampalcheLine()) {
              <p class="feedback-panel__aside">{{ pampalcheLine() }}</p>
            }
          </div>

          <button class="btn btn--primary" type="button" (click)="confirm()">
            {{ step().continueLabel || 'Дальше' }}
          </button>
        }
      </div>
    </article>
  `,
})
export class QuizCardComponent {
  private readonly contentService = inject(ContentService);

  readonly step = input.required<QuizStep>();
  readonly savedAnswer = input<{ selectedOptionId: string; isCorrect: boolean } | null>(null);
  readonly completed = output<{ selectedOptionId: string; isCorrect: boolean }>();

  readonly selectedOptionId = signal<string | null>(null);
  readonly pampalcheLine = signal('');
  readonly locked = signal(false);

  constructor() {
    effect(() => {
      const savedAnswer = this.savedAnswer();
      this.selectedOptionId.set(savedAnswer?.selectedOptionId ?? null);
      this.locked.set(!!savedAnswer);
      if (savedAnswer) {
        this.pampalcheLine.set(
          this.contentService.getRandomPhrase(savedAnswer.isCorrect ? 'correct' : 'incorrect'),
        );
      } else {
        this.pampalcheLine.set('');
      }
    });
  }

  isCorrect(): boolean {
    return this.selectedOptionId() === this.step().correctOptionId;
  }

  answer(optionId: string): void {
    if (this.locked()) {
      return;
    }

    this.selectedOptionId.set(optionId);
    this.pampalcheLine.set(
      this.contentService.getRandomPhrase(
        optionId === this.step().correctOptionId ? 'correct' : 'incorrect',
      ),
    );
  }

  confirm(): void {
    if (!this.selectedOptionId()) {
      return;
    }

    this.completed.emit({
      selectedOptionId: this.selectedOptionId() as string,
      isCorrect: this.isCorrect(),
    });
  }
}
