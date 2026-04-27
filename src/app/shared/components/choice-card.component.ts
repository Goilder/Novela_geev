import { Component, effect, input, output, signal } from '@angular/core';
import { ChoiceStep } from '../../core/models/game-content.model';

@Component({
  selector: 'app-choice-card',
  standalone: true,
  template: `
    <article class="step-card story-card">
      <div class="step-card__body">
        <p class="eyebrow">Выбор</p>
        <h2>{{ step().title }}</h2>
        <p class="lede">{{ step().prompt }}</p>

        <div class="option-grid">
          @for (option of step().options; track option.id) {
            <button
              class="option-button"
              type="button"
              [class.is-active]="selectedOptionId() === option.id"
              (click)="select(option.id)"
            >
              {{ option.label }}
            </button>
          }
        </div>

        @if (selectedResponse()) {
          <div class="feedback-panel feedback-panel--soft">
            <strong>Пампалче отвечает:</strong>
            <p>{{ selectedResponse() }}</p>
          </div>

          <button class="btn btn--primary" type="button" (click)="confirmChoice()">
            {{ step().continueLabel || 'Продолжить' }}
          </button>
        }
      </div>
    </article>
  `,
})
export class ChoiceCardComponent {
  readonly step = input.required<ChoiceStep>();
  readonly savedAnswer = input<{ selectedOptionId: string } | null>(null);
  readonly completed = output<{ selectedOptionId: string }>();

  readonly selectedOptionId = signal<string | null>(null);
  readonly selectedResponse = signal('');

  constructor() {
    effect(() => {
      const savedAnswer = this.savedAnswer();
      const step = this.step();
      const selectedOptionId = savedAnswer?.selectedOptionId ?? null;
      this.selectedOptionId.set(selectedOptionId);
      const response = step.options.find((option) => option.id === selectedOptionId)?.response ?? '';
      this.selectedResponse.set(response);
    });
  }

  select(optionId: string): void {
    this.selectedOptionId.set(optionId);
    const response =
      this.step().options.find((option) => option.id === optionId)?.response ?? '';
    this.selectedResponse.set(response);
  }

  confirmChoice(): void {
    if (!this.selectedOptionId()) {
      return;
    }

    this.completed.emit({
      selectedOptionId: this.selectedOptionId() as string,
    });
  }
}
