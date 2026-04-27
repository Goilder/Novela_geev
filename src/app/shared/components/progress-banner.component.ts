import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-progress-banner',
  standalone: true,
  template: `
    <section class="story-card progress-banner">
      <div class="progress-banner__copy">
        <p class="eyebrow">{{ eyebrow() }}</p>
        <h1>{{ title() }}</h1>
        @if (subtitle()) {
          <p class="lede">{{ subtitle() }}</p>
        }
      </div>

      <div class="progress-banner__chips">
        @if (stepLabel()) {
          <span class="status-chip">{{ stepLabel() }}</span>
        }
        <span class="status-chip status-chip--warm">✦ {{ sparks() }} искр</span>
      </div>
    </section>
  `,
})
export class ProgressBannerComponent {
  readonly eyebrow = input('Путешествие');
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  readonly currentStep = input<number | null>(null);
  readonly totalSteps = input<number | null>(null);
  readonly sparks = input(0);

  readonly stepLabel = computed(() => {
    const currentStep = this.currentStep();
    const totalSteps = this.totalSteps();
    if (!currentStep || !totalSteps) {
      return '';
    }

    return `Шаг ${currentStep} из ${totalSteps}`;
  });
}
