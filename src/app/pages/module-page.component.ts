import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ChoiceCardComponent } from '../shared/components/choice-card.component';
import { CrosswordCardComponent } from '../shared/components/crossword-card.component';
import { DialogueCardComponent } from '../shared/components/dialogue-card.component';
import { PhotoCardComponent } from '../shared/components/photo-card.component';
import { ProgressBannerComponent } from '../shared/components/progress-banner.component';
import { QuizCardComponent } from '../shared/components/quiz-card.component';
import { ReflectionCardComponent } from '../shared/components/reflection-card.component';
import { VideoCardComponent } from '../shared/components/video-card.component';
import { ModuleStep } from '../core/models/game-content.model';
import { ContentService } from '../core/services/content.service';
import { ProgressService } from '../core/services/progress.service';

@Component({
  selector: 'app-module-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ProgressBannerComponent,
    DialogueCardComponent,
    ChoiceCardComponent,
    QuizCardComponent,
    ReflectionCardComponent,
    VideoCardComponent,
    CrosswordCardComponent,
    PhotoCardComponent,
  ],
  template: `
    @if (module(); as currentModule) {
      <main class="page-shell page-shell--module">
        <app-progress-banner
          eyebrow="Модуль {{ currentModule.order }}"
          [title]="currentModule.title"
          [subtitle]="currentModule.subtitle"
          [currentStep]="currentStepIndex() + 1"
          [totalSteps]="currentModule.steps.length"
          [sparks]="progressService.state().sparks"
        />

        <div class="module-toolbar">
          <a class="btn btn--ghost" routerLink="/map">Вернуться к карте</a>
          <span class="status-chip status-chip--warm">Награда за модуль: {{ currentModule.reward.sparks }} искр</span>
        </div>

        <section class="step-stage">
          @if (currentStep(); as step) {
            @switch (step.type) {
              @case ('dialogue') {
                <app-dialogue-card [step]="$any(step)" (completed)="finishStep()" />
              }
              @case ('choice') {
                <app-choice-card
                  [step]="$any(step)"
                  [savedAnswer]="$any(savedAnswer())"
                  (completed)="finishStep($event)"
                />
              }
              @case ('quiz') {
                <app-quiz-card
                  [step]="$any(step)"
                  [savedAnswer]="$any(savedAnswer())"
                  (completed)="finishStep($event)"
                />
              }
              @case ('reflection') {
                <app-reflection-card
                  [step]="$any(step)"
                  [savedAnswer]="$any(savedAnswer())"
                  (completed)="finishStep($event)"
                />
              }
              @case ('video') {
                <app-video-card [step]="$any(step)" (completed)="finishStep()" />
              }
              @case ('crossword') {
                <app-crossword-card
                  [step]="$any(step)"
                  [savedAnswer]="$any(savedAnswer())"
                  (completed)="finishStep($event)"
                />
              }
              @case ('photo') {
                <app-photo-card
                  [step]="$any(step)"
                  [savedAnswer]="$any(savedAnswer())"
                  (completed)="finishStep($event)"
                />
              }
            }
          }
        </section>
      </main>
    }
  `,
})
export class ModulePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly contentService = inject(ContentService);
  protected readonly progressService = inject(ProgressService);

  private readonly moduleId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('moduleId') ?? '')),
    { initialValue: '' },
  );

  protected readonly currentStepIndex = signal(0);
  protected readonly module = computed(() => this.contentService.getModuleById(this.moduleId()));
  protected readonly currentStep = computed(() => {
    const module = this.module();
    return module?.steps[this.currentStepIndex()] ?? null;
  });
  protected readonly savedAnswer = computed(() => {
    const module = this.module();
    const step = this.currentStep();
    if (!module || !step) {
      return null;
    }

    return this.progressService.getStepAnswer(module.id, step.id);
  });

  constructor() {
    effect(() => {
      const module = this.module();
      if (!module) {
        return;
      }

      const moduleState = this.progressService.getModuleState(module.id);
      if (moduleState.completed) {
        queueMicrotask(() => {
          void this.router.navigate(['/transition', module.id]);
        });
        return;
      }

      const nextStepIndex = Math.min(moduleState.currentStepIndex, module.steps.length - 1);
      this.currentStepIndex.set(nextStepIndex);
    });
  }

  finishStep(answer?: unknown): void {
    const module = this.module();
    const step = this.currentStep();
    if (!module || !step) {
      return;
    }

    if (answer !== undefined) {
      this.progressService.updateStepAnswer(module.id, step.id, answer);
    }

    const nextStepIndex = this.currentStepIndex() + 1;
    if (nextStepIndex >= module.steps.length) {
      this.progressService.completeModule(module);
      void this.router.navigate(['/transition', module.id]);
      return;
    }

    this.progressService.updateCurrentStep(module.id, nextStepIndex);
    this.currentStepIndex.set(nextStepIndex);
  }
}
