import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
  BranchingChoice,
  CrosswordEntry,
  GameModule,
  ModuleFour,
  ModuleOne,
  ModuleProgressData,
  ModuleThree,
  ModuleTwo
} from '../models/game-content.model';
import { ContentService } from '../services/content.service';
import { ProgressService } from '../services/progress.service';

@Component({
  standalone: true,
  selector: 'app-module-page',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <ng-container *ngIf="module() as currentModule; else missingModule">
      <section class="module-page" *ngIf="isUnlocked(); else lockedModule">
        <header class="module-hero card">
          <div>
            <span class="eyebrow">Модуль {{ moduleNumber() }}</span>
            <h1>{{ currentModule.title }}</h1>
            <p>{{ currentModule.subtitle }}</p>
          </div>
          <a routerLink="/map" class="ghost-link">Вернуться к карте</a>
        </header>

        <section [ngSwitch]="currentModule.id">
          <ng-container *ngSwitchCase="'module_1'">
            <ng-container *ngTemplateOutlet="moduleOneTpl; context: { $implicit: currentModule }" />
          </ng-container>

          <ng-container *ngSwitchCase="'module_2'">
            <ng-container *ngTemplateOutlet="moduleTwoTpl; context: { $implicit: currentModule }" />
          </ng-container>

          <ng-container *ngSwitchCase="'module_3'">
            <ng-container *ngTemplateOutlet="moduleThreeTpl; context: { $implicit: currentModule }" />
          </ng-container>

          <ng-container *ngSwitchCase="'module_4'">
            <ng-container *ngTemplateOutlet="moduleFourTpl; context: { $implicit: currentModule }" />
          </ng-container>
        </section>
      </section>
    </ng-container>

    <ng-template #lockedModule>
      <section class="card state-card">
        <h1>Этот модуль пока закрыт</h1>
        <p>Сначала завершите предыдущий этап путешествия.</p>
        <a routerLink="/map" class="primary-link">На карту модулей</a>
      </section>
    </ng-template>

    <ng-template #missingModule>
      <section class="card state-card">
        <h1>Модуль не найден</h1>
        <a routerLink="/map" class="primary-link">На карту модулей</a>
      </section>
    </ng-template>

    <ng-template #moduleOneTpl let-moduleData>
      <section class="module-stack">
        <article class="scene-card scene-card--hero">
          <h2>Вступление</h2>
          <p>{{ asModuleOne(moduleData).intro_scene.narration }}</p>
          <p *ngFor="let line of asModuleOne(moduleData).intro_scene.pampalche">{{ line }}</p>
        </article>

        <article class="scene-card">
          <h2>Обсудим сказку вместе</h2>
          <p *ngFor="let line of asModuleOne(moduleData).post_booktrailer_block.pampalche">{{ line }}</p>

          <div class="question-card" *ngFor="let item of asModuleOne(moduleData).post_booktrailer_block.family_discussion_questions">
            <h3>{{ item.question_child }}</h3>
            <textarea
              [ngModel]="moduleState().discussionAnswers?.[item.id + '_child'] ?? ''"
              (ngModelChange)="updateDiscussion(item.id + '_child', $event)"
              rows="3"
              placeholder="Ответ ребенка"></textarea>

            <h3>{{ item.question_parent }}</h3>
            <textarea
              [ngModel]="moduleState().discussionAnswers?.[item.id + '_parent'] ?? ''"
              (ngModelChange)="updateDiscussion(item.id + '_parent', $event)"
              rows="3"
              placeholder="Ответ взрослого"></textarea>

            <p class="followup">{{ item.pampalche_followup }}</p>
          </div>
        </article>

        <article class="scene-card" *ngIf="choice() as branchChoice">
          <h2>{{ branchChoice.prompt }}</h2>
          <div class="choice-grid">
            <button type="button" class="choice-btn"
              *ngFor="let option of branchChoice.options"
              [class.choice-btn--selected]="moduleState().branchChoice === option.text"
              (click)="selectBranchChoice(option.text)">
              <strong>{{ option.text }}</strong>
              <span>{{ option.response }}</span>
            </button>
          </div>
        </article>

        <article class="scene-card">
          <h2>{{ asModuleOne(moduleData).test.title }}</h2>
          <p>{{ asModuleOne(moduleData).test.instruction }}</p>

          <div class="question-card" *ngFor="let question of asModuleOne(moduleData).test.questions; index as idx">
            <h3>{{ idx + 1 }}. {{ question.question }}</h3>

            <label class="option-row" *ngFor="let option of question.options; index as optionIndex">
              <input
                type="radio"
                [name]="question.id"
                [checked]="moduleState().quizAnswers?.[question.id] === optionIndex"
                (change)="answerQuiz(question.id, optionIndex)">
              <span>{{ option }}</span>
            </label>

            <p class="feedback" *ngIf="moduleState().quizAnswers?.[question.id] !== undefined">
              {{
                moduleState().quizAnswers?.[question.id] === question.correct_index
                  ? question.correct_feedback
                  : question.wrong_feedback
              }}
            </p>
          </div>
        </article>

        <article class="scene-card">
          <h2>{{ asModuleOne(moduleData).creative_task.title }}</h2>
          <p>{{ asModuleOne(moduleData).creative_task.instruction }}</p>
          <p *ngFor="let line of asModuleOne(moduleData).creative_task.pampalche">{{ line }}</p>
          <textarea
            [ngModel]="moduleState().creativeAnswer ?? ''"
            (ngModelChange)="updateCreative($event)"
            rows="5"
            placeholder="Напишите семейный ответ, историю или пожелание"></textarea>
        </article>

        <article class="scene-card scene-card--completion">
          <h2>Завершение модуля</h2>
          <p *ngFor="let line of asModuleOne(moduleData).completion.pampalche">{{ line }}</p>
          <button type="button" class="primary-btn" (click)="completeCurrentModule(asModuleOne(moduleData).completion.reward_id)">
            Завершить модуль
          </button>
        </article>
      </section>
    </ng-template>

    <ng-template #moduleTwoTpl let-moduleData>
      <section class="module-stack">
        <article class="scene-card scene-card--hero">
          <h2>Вступление</h2>
          <p>{{ asModuleTwo(moduleData).intro_scene.narration }}</p>
          <p *ngFor="let line of asModuleTwo(moduleData).intro_scene.pampalche">{{ line }}</p>
        </article>

        <article class="scene-card">
          <h2>Зачем мы делаем оберег</h2>
          <p>{{ asModuleTwo(moduleData).motivation.story }}</p>
          <p *ngFor="let line of asModuleTwo(moduleData).motivation.pampalche">{{ line }}</p>
        </article>

        <article class="scene-card">
          <h2>Материалы</h2>
          <div class="chip-list">
            <span class="chip" *ngFor="let item of asModuleTwo(moduleData).materials">{{ item }}</span>
          </div>
        </article>

        <article class="scene-card">
          <h2>Шаги мастер-класса</h2>
          <ol class="steps">
            <li *ngFor="let step of asModuleTwo(moduleData).step_by_step">{{ step }}</li>
          </ol>
        </article>

        <article class="scene-card">
          <h2>Вопросы для семьи</h2>
          <div class="question-card" *ngFor="let item of asModuleTwo(moduleData).reflection_questions; index as i">
            <h3>Вопрос {{ i + 1 }}</h3>
            <p>{{ item }}</p>
            <textarea
              [ngModel]="moduleState().craftNotes?.['reflection_' + i] ?? ''"
              (ngModelChange)="updateCraftNote('reflection_' + i, $event)"
              rows="3"
              placeholder="Семейный ответ"></textarea>
          </div>
        </article>

        <article class="scene-card">
          <h2>{{ asModuleTwo(moduleData).good_luck_task.title }}</h2>
          <p>{{ asModuleTwo(moduleData).good_luck_task.instruction }}</p>
          <p *ngFor="let line of asModuleTwo(moduleData).good_luck_task.pampalche">{{ line }}</p>
          <input type="file" accept="image/*" (change)="onPhotoSelected($event)">
          <div class="photo-preview" *ngIf="moduleState().craftPhotoUrl as photoUrl">
            <img [src]="photoUrl" alt="Загруженный семейный результат">
          </div>
        </article>

        <article class="scene-card scene-card--completion">
          <h2>{{ asModuleTwo(moduleData).reward.title }}</h2>
          <p>{{ asModuleTwo(moduleData).reward.text }}</p>
          <p *ngFor="let line of asModuleTwo(moduleData).completion.pampalche">{{ line }}</p>
          <button type="button" class="primary-btn" (click)="completeCurrentModule(asModuleTwo(moduleData).reward.id)">
            Завершить модуль
          </button>
        </article>
      </section>
    </ng-template>

    <ng-template #moduleThreeTpl let-moduleData>
      <section class="module-stack">
        <article class="scene-card scene-card--hero">
          <h2>Вступление</h2>
          <p>{{ asModuleThree(moduleData).intro_scene.narration }}</p>
          <p *ngFor="let line of asModuleThree(moduleData).intro_scene.pampalche">{{ line }}</p>
        </article>

        <article class="scene-card">
          <h2>{{ asModuleThree(moduleData).crossword.title }}</h2>
          <div class="crossword-grid">
            <div class="crossword-row" *ngFor="let item of asModuleThree(moduleData).crossword.entries">
              <div class="crossword-row__meta">
                <strong>{{ item.id }}.</strong>
                <span>{{ item.clue }}</span>
              </div>
              <div class="crossword-row__input">
                <input
                  type="text"
                  [ngModel]="moduleState().crosswordAnswers?.[entryKey(item)] ?? ''"
                  (ngModelChange)="updateCrosswordAnswer(entryKey(item), $event)"
                  [placeholder]="'Слово из ' + item.answer.length + ' букв'">
                <button type="button" class="ghost-btn" (click)="checkCrosswordEntry(item)">Проверить</button>
                <button type="button" class="ghost-btn" (click)="showHint(item)">Подсказка</button>
              </div>
              <p class="feedback" *ngIf="crosswordFeedback()[entryKey(item)]">
                {{ crosswordFeedback()[entryKey(item)] }}
              </p>
            </div>
          </div>
        </article>

        <article class="scene-card">
          <h2>{{ asModuleThree(moduleData).city_arrival_task.title }}</h2>
          <p>{{ asModuleThree(moduleData).city_arrival_task.instruction }}</p>
          <textarea
            [ngModel]="moduleState().craftNotes?.['city_arrival'] ?? ''"
            (ngModelChange)="updateCraftNote('city_arrival', $event)"
            rows="4"
            [placeholder]="asModuleThree(moduleData).city_arrival_task.output_format"></textarea>
        </article>

        <article class="scene-card">
          <h2>Финальный вопрос</h2>
          <p *ngFor="let line of asModuleThree(moduleData).final_reflection.pampalche">{{ line }}</p>
          <p>{{ asModuleThree(moduleData).final_reflection.question }}</p>
          <textarea
            [ngModel]="moduleState().craftNotes?.['final_reflection'] ?? ''"
            (ngModelChange)="updateCraftNote('final_reflection', $event)"
            rows="4"
            placeholder="Семейный ответ"></textarea>
          <p class="followup">{{ asModuleThree(moduleData).final_reflection.followup }}</p>
        </article>

        <article class="scene-card scene-card--completion">
          <h2>Искра смекалки</h2>
          <p *ngFor="let line of asModuleThree(moduleData).completion.pampalche">{{ line }}</p>
          <button type="button" class="primary-btn" (click)="completeCurrentModule(asModuleThree(moduleData).completion.reward_id)">
            Завершить модуль
          </button>
        </article>
      </section>
    </ng-template>

    <ng-template #moduleFourTpl let-moduleData>
      <section class="module-stack">
        <article class="scene-card scene-card--hero">
          <h2>Вступление</h2>
          <p>{{ asModuleFour(moduleData).intro_scene.narration }}</p>
          <p *ngFor="let line of asModuleFour(moduleData).intro_scene.pampalche">{{ line }}</p>
        </article>

        <article class="scene-card">
          <h2>{{ asModuleFour(moduleData).dish_description.name }}</h2>
          <p>{{ asModuleFour(moduleData).dish_description.note }}</p>
          <p>{{ asModuleFour(moduleData).dish_description.why_this_dish }}</p>
        </article>

        <article class="scene-card">
          <h2>Ингредиенты</h2>
          <div class="chip-list">
            <span class="chip" *ngFor="let ingredient of asModuleFour(moduleData).ingredients">{{ ingredient }}</span>
          </div>
        </article>

        <article class="scene-card">
          <h2>Шаги приготовления</h2>
          <ol class="steps">
            <li *ngFor="let step of asModuleFour(moduleData).step_by_step">{{ step }}</li>
          </ol>
        </article>

        <article class="scene-card">
          <h2>Мини-задания за столом</h2>
          <div class="question-card" *ngFor="let item of asModuleFour(moduleData).mini_tasks">
            <h3>{{ item.task }}</h3>
            <textarea
              [ngModel]="moduleState().cookingNotes?.[item.id] ?? ''"
              (ngModelChange)="updateCookingNote(item.id, $event)"
              rows="3"
              placeholder="Ваш семейный ответ"></textarea>
          </div>
        </article>

        <article class="scene-card">
          <h2>{{ asModuleFour(moduleData).family_final_block.title }}</h2>
          <div class="question-card" *ngFor="let item of asModuleFour(moduleData).family_final_block.questions; index as i">
            <p>{{ item }}</p>
            <textarea
              [ngModel]="moduleState().cookingNotes?.['family_final_' + i] ?? ''"
              (ngModelChange)="updateCookingNote('family_final_' + i, $event)"
              rows="3"
              placeholder="Семейный ответ"></textarea>
          </div>
          <p class="followup">{{ asModuleFour(moduleData).family_final_block.ritual }}</p>
        </article>

        <article class="scene-card scene-card--completion">
          <h2>Финальная искра</h2>
          <p *ngFor="let line of asModuleFour(moduleData).completion.pampalche">{{ line }}</p>
          <p *ngFor="let line of asModuleFour(moduleData).festive_ending.pampalche">{{ line }}</p>
          <button type="button" class="primary-btn" (click)="completeCurrentModule(asModuleFour(moduleData).completion.reward_id)">
            Завершить модуль
          </button>
        </article>
      </section>
    </ng-template>
  `,
  styles: [`
    .module-page,
    .module-stack {
      display: grid;
      gap: 1rem;
    }

    .card,
    .scene-card {
      padding: 1.4rem;
      border-radius: 2rem;
      background: rgba(255, 251, 244, 0.84);
      border: 1px solid rgba(138, 90, 60, 0.14);
      box-shadow: 0 18px 44px rgba(90, 58, 41, 0.08);
    }

    .scene-card--hero {
      background:
        radial-gradient(circle at top right, rgba(221, 228, 242, 0.8), transparent 25%),
        rgba(255, 251, 244, 0.88);
    }

    .scene-card--completion {
      border-color: rgba(113, 140, 90, 0.32);
    }

    .module-hero {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
    }

    .eyebrow {
      display: inline-flex;
      padding: 0.45rem 0.8rem;
      border-radius: 999px;
      background: rgba(199, 217, 183, 0.52);
      color: #557043;
      font-weight: 700;
      margin-bottom: 0.9rem;
    }

    .ghost-link,
    .primary-link,
    .primary-btn,
    .ghost-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 3rem;
      border-radius: 999px;
      padding: 0.75rem 1rem;
      font: inherit;
      font-weight: 700;
      text-decoration: none;
      border: none;
      cursor: pointer;
    }

    .ghost-link,
    .ghost-btn {
      background: rgba(113, 140, 90, 0.12);
      color: #5c6d48;
    }

    .primary-link,
    .primary-btn {
      background: linear-gradient(135deg, #c86d4a, #b6453a);
      color: #fffaf6;
    }

    .state-card {
      text-align: center;
      display: grid;
      gap: 1rem;
      justify-items: center;
    }

    .question-card {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 1.4rem;
      background: rgba(247, 241, 227, 0.8);
    }

    .question-card h3 {
      margin-bottom: 0.5rem;
    }

    .choice-grid,
    .chip-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .choice-btn {
      width: min(100%, 20rem);
      text-align: left;
      padding: 1rem;
      border-radius: 1.4rem;
      border: 1px solid rgba(138, 90, 60, 0.18);
      background: #fffdf9;
      cursor: pointer;
      display: grid;
      gap: 0.4rem;
    }

    .choice-btn--selected {
      border-color: rgba(182, 69, 58, 0.38);
      background: rgba(255, 244, 237, 0.96);
    }

    .chip {
      padding: 0.7rem 0.95rem;
      border-radius: 999px;
      background: rgba(221, 228, 242, 0.8);
      color: #556071;
      font-weight: 700;
    }

    .steps {
      margin: 0;
      padding-left: 1.2rem;
      line-height: 1.9;
    }

    .option-row {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      margin: 0.75rem 0;
      line-height: 1.55;
    }

    textarea,
    input[type="text"] {
      width: 100%;
      margin-top: 0.45rem;
      border-radius: 1rem;
      border: 1px solid rgba(138, 90, 60, 0.2);
      background: #fffdfa;
      padding: 0.85rem 1rem;
      font: inherit;
      color: inherit;
    }

    .crossword-grid {
      display: grid;
      gap: 1rem;
    }

    .crossword-row {
      padding: 1rem;
      border-radius: 1.4rem;
      background: rgba(247, 241, 227, 0.8);
    }

    .crossword-row__meta {
      display: flex;
      gap: 0.75rem;
      align-items: baseline;
      margin-bottom: 0.75rem;
    }

    .crossword-row__input {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .crossword-row__input input {
      margin-top: 0;
    }

    .feedback,
    .followup {
      margin-top: 0.75rem;
      color: #7a5a49;
      font-weight: 600;
    }

    .photo-preview {
      margin-top: 1rem;
      overflow: hidden;
      border-radius: 1.2rem;
      max-width: 22rem;
    }

    .photo-preview img {
      display: block;
      width: 100%;
      height: auto;
    }

    @media (max-width: 860px) {
      .module-hero {
        flex-direction: column;
      }

      .crossword-row__input {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `]
})
export class ModulePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly content = inject(ContentService);
  readonly progress = inject(ProgressService);

  readonly moduleId = signal('');
  readonly crosswordFeedback = signal<Record<string, string>>({});
  readonly module = computed(() => this.content.moduleById(this.moduleId()));
  readonly isUnlocked = computed(() => this.progress.isModuleUnlocked(this.moduleId()));
  readonly moduleNumber = computed(() => this.moduleId().replace('module_', ''));
  readonly moduleState = computed<ModuleProgressData>(() => this.progress.progress().moduleData[this.moduleId()] ?? {});
  readonly choice = computed<BranchingChoice | null>(() => {
    const current = this.module();
    if (!current || current.id !== 'module_1') {
      return null;
    }

    return (current as ModuleOne).branching_choices[0] ?? null;
  });

  constructor() {
    effect(() => {
      const moduleId = this.route.snapshot.paramMap.get('moduleId') ?? '';
      this.moduleId.set(moduleId);
      if (moduleId) {
        this.progress.updateActiveModule(moduleId);
      }
    });
  }

  asModuleOne(moduleData: GameModule): ModuleOne {
    return moduleData as ModuleOne;
  }

  asModuleTwo(moduleData: GameModule): ModuleTwo {
    return moduleData as ModuleTwo;
  }

  asModuleThree(moduleData: GameModule): ModuleThree {
    return moduleData as ModuleThree;
  }

  asModuleFour(moduleData: GameModule): ModuleFour {
    return moduleData as ModuleFour;
  }

  updateDiscussion(key: string, value: string): void {
    this.progress.updateModuleData(this.moduleId(), {
      discussionAnswers: {
        ...(this.moduleState().discussionAnswers ?? {}),
        [key]: value
      }
    });
  }

  selectBranchChoice(value: string): void {
    this.progress.updateModuleData(this.moduleId(), { branchChoice: value });
  }

  answerQuiz(questionId: string, optionIndex: number): void {
    this.progress.updateModuleData(this.moduleId(), {
      quizAnswers: {
        ...(this.moduleState().quizAnswers ?? {}),
        [questionId]: optionIndex
      }
    });
  }

  updateCreative(value: string): void {
    this.progress.updateModuleData(this.moduleId(), { creativeAnswer: value });
  }

  updateCraftNote(key: string, value: string): void {
    this.progress.updateModuleData(this.moduleId(), {
      craftNotes: {
        ...(this.moduleState().craftNotes ?? {}),
        [key]: value
      }
    });
  }

  updateCookingNote(key: string, value: string): void {
    this.progress.updateModuleData(this.moduleId(), {
      cookingNotes: {
        ...(this.moduleState().cookingNotes ?? {}),
        [key]: value
      }
    });
  }

  entryKey(entry: CrosswordEntry): string {
    return `entry_${entry.id}`;
  }

  updateCrosswordAnswer(key: string, value: string): void {
    this.progress.updateModuleData(this.moduleId(), {
      crosswordAnswers: {
        ...(this.moduleState().crosswordAnswers ?? {}),
        [key]: value
      }
    });
  }

  showHint(entry: CrosswordEntry): void {
    this.crosswordFeedback.update((state) => ({
      ...state,
      [this.entryKey(entry)]: entry.hint
    }));
  }

  checkCrosswordEntry(entry: CrosswordEntry): void {
    const answer = (this.moduleState().crosswordAnswers?.[this.entryKey(entry)] ?? '').trim().toUpperCase();
    this.crosswordFeedback.update((state) => ({
      ...state,
      [this.entryKey(entry)]: answer === entry.answer ? entry.success : entry.error
    }));
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.progress.updateModuleData(this.moduleId(), { craftPhotoUrl: String(reader.result) });
    };
    reader.readAsDataURL(file);
  }

  completeCurrentModule(rewardId: string): void {
    this.progress.addReward(rewardId);
    const nextModuleId = this.content.nextModuleId(this.moduleId());

    if (this.moduleId() === 'module_1') {
      this.progress.addReward('badge_talk');
      this.progress.addReward('badge_kind');
    }

    if (this.moduleId() === 'module_2') {
      this.progress.addReward('badge_create');
    }

    if (this.moduleId() === 'module_4') {
      this.progress.addReward('badge_full');
    }

    this.progress.completeModule(this.moduleId(), rewardId, nextModuleId);

    if (nextModuleId) {
      void this.router.navigate(['/modules', nextModuleId]);
      return;
    }

    void this.router.navigate(['/final']);
  }
}
