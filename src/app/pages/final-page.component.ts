import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';

import { ContentService } from '../services/content.service';
import { ProgressService } from '../services/progress.service';

@Component({
  standalone: true,
  selector: 'app-final-page',
  imports: [CommonModule],
  template: `
    <section class="final-page" *ngIf="content.content() as game">
      <div class="final-page__hero card">
        <span class="eyebrow">Финальный круг</span>
        <h1>Волшебный круг семейного тепла</h1>
        <p *ngIf="!progress.allModulesCompleted()">
          Финал откроется полностью после прохождения всех четырех модулей.
        </p>
        <p *ngIf="progress.allModulesCompleted()">
          {{ game.pampalche_lines.finale[0] }}
        </p>
      </div>

      <div class="spark-row">
        <article class="spark-card" *ngFor="let spark of sparks()"
          [class.spark-card--active]="earnedSet().has(spark.id)">
          <strong>{{ spark.title }}</strong>
          <p>{{ spark.text }}</p>
        </article>
      </div>

      <div class="card final-page__certificate">
        <h2>Сертификат семьи</h2>
        <p>
          В MVP сертификат формируется как экран-достижение. Когда будут готовы финальные ассеты,
          сюда можно подключить PDF-генерацию по шаблону ui_certificate_template.
        </p>
        <div class="certificate-preview" [class.certificate-preview--ready]="progress.allModulesCompleted()">
          <div>Пока все вместе</div>
          <strong>{{ progress.allModulesCompleted() ? 'Хранители семейного круга' : 'Путь еще продолжается' }}</strong>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .final-page {
      display: grid;
      gap: 1.2rem;
    }

    .card {
      padding: 1.5rem;
      border-radius: 2rem;
      background: rgba(255, 251, 244, 0.84);
      border: 1px solid rgba(138, 90, 60, 0.14);
      box-shadow: 0 18px 44px rgba(90, 58, 41, 0.08);
    }

    .eyebrow {
      display: inline-flex;
      padding: 0.45rem 0.8rem;
      border-radius: 999px;
      background: rgba(242, 232, 201, 0.9);
      color: #8a5a3c;
      font-weight: 700;
      margin-bottom: 0.9rem;
    }

    .spark-row {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 1rem;
    }

    .spark-card {
      padding: 1.15rem;
      border-radius: 1.5rem;
      background: rgba(221, 228, 242, 0.28);
      border: 1px solid rgba(184, 199, 217, 0.8);
      opacity: 0.65;
    }

    .spark-card--active {
      opacity: 1;
      background: linear-gradient(180deg, rgba(242, 232, 201, 0.9), rgba(255, 249, 234, 0.95));
      border-color: rgba(200, 109, 74, 0.4);
    }

    .certificate-preview {
      margin-top: 1rem;
      min-height: 14rem;
      border-radius: 1.5rem;
      border: 2px dashed rgba(138, 90, 60, 0.26);
      display: grid;
      place-items: center;
      text-align: center;
      padding: 1rem;
      color: #7b6557;
    }

    .certificate-preview--ready {
      background: linear-gradient(180deg, #f7f1e3, #f2e8c9);
      border-style: solid;
      color: #6f4330;
    }

    @media (max-width: 920px) {
      .spark-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FinalPageComponent {
  readonly content = inject(ContentService);
  readonly progress = inject(ProgressService);

  readonly sparks = computed(() => this.content.content()?.rewards.story_sparks ?? []);
  readonly earnedSet = computed(() => new Set(this.progress.progress().earnedRewardIds));
}
