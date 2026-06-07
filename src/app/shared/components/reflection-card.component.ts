import { Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReflectionStep } from '../../core/models/game-content.model';

@Component({
  selector: 'app-reflection-card',
  standalone: true,
  imports: [FormsModule],
  template: `
    <article class="step-card story-card">
      @if (step().illustrationAsset) {
        <div class="scene-cover">
          <img [src]="step().illustrationAsset" [alt]="step().title" />
        </div>
      }
      <div class="step-card__body">
        <p class="eyebrow">Семейный ответ</p>
        <h2>{{ step().title }}</h2>
        <p class="lede">{{ step().prompt }}</p>

        <div class="field-stack">
          @for (field of step().fields; track field.id) {
            <label class="form-field">
              <span>{{ field.label }}</span>
              <textarea
                rows="3"
                [maxLength]="field.maxLength || 240"
                [placeholder]="field.placeholder"
                [ngModel]="draft()[field.id] || ''"
                (ngModelChange)="updateField(field.id, $event)"
              ></textarea>
            </label>
          }
        </div>

        <button class="btn btn--primary" type="button" [disabled]="!isComplete()" (click)="confirm()">
          {{ step().continueLabel || 'Продолжить' }}
        </button>
      </div>
    </article>
  `,
})
export class ReflectionCardComponent {
  readonly step = input.required<ReflectionStep>();
  readonly savedAnswer = input<Record<string, string> | null>(null);
  readonly completed = output<Record<string, string>>();

  readonly draft = signal<Record<string, string>>({});

  constructor() {
    effect(() => {
      this.draft.set(this.savedAnswer() ?? {});
    });
  }

  updateField(fieldId: string, value: string): void {
    this.draft.update((draft) => ({
      ...draft,
      [fieldId]: value,
    }));
  }

  isComplete(): boolean {
    return this.step().fields.every((field) => {
      const value = this.draft()[field.id] ?? '';
      return value.trim().length > 0;
    });
  }

  confirm(): void {
    if (!this.isComplete()) {
      return;
    }

    this.completed.emit(this.draft());
  }
}
