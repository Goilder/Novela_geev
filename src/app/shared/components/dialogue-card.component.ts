import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { DialogueStep } from '../../core/models/game-content.model';

@Component({
  selector: 'app-dialogue-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="step-card story-card">
      @if (step().sceneAsset) {
        <div class="scene-cover">
          <img [src]="step().sceneAsset" [alt]="step().title" />
        </div>
      }

      <div class="step-card__body">
        <p class="eyebrow">Диалог</p>
        <h2>{{ step().title }}</h2>
        @if (step().description) {
          <p class="lede">{{ step().description }}</p>
        }

        <div class="dialogue-list">
          @for (line of step().lines; track line.text) {
            <div class="dialogue-bubble" [class.dialogue-bubble--family]="line.role === 'family'">
              <strong>{{ line.speaker }}</strong>
              <p>{{ line.text }}</p>
            </div>
          }
        </div>

        <button class="btn btn--primary" type="button" (click)="completed.emit()">
          {{ step().continueLabel || 'Дальше' }}
        </button>
      </div>
    </article>
  `,
})
export class DialogueCardComponent {
  readonly step = input.required<DialogueStep>();
  readonly completed = output<void>();
}
