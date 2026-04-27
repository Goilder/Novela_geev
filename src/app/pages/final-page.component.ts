import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';

import { FIGMA_ASSETS } from '../figma-assets';
import { ContentService } from '../services/content.service';
import { ProgressService } from '../services/progress.service';

@Component({
  standalone: true,
  selector: 'app-final-page',
  imports: [CommonModule],
  template: `
    <section class="final-page" *ngIf="content.content() as game" [style.background-image]="'url(' + assets.familyPlatformAlt + ')'">
      <div class="final-page__panel">
        <div class="final-page__hero">
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

        <div class="final-page__certificate">
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
      </div>
    </section>
  `,
  styles: [`
    .final-page {
      min-height: calc(100dvh - 80px);
      background-position: center;
      background-size: cover;
      padding: 3rem 2rem;
    }

    .final-page__panel {
      max-width: 70rem;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.22);
      backdrop-filter: blur(14px);
      border: 1px solid rgba(255, 255, 255, 0.35);
      border-radius: 2rem;
      padding: 1.5rem;
      color: #fff;
    }

    .spark-row {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 1rem;
      margin: 1rem 0;
    }

    .spark-card {
      padding: 1.15rem;
      border-radius: 1.5rem;
      background: rgba(255,255,255,0.18);
      border: 1px solid rgba(255,255,255,0.35);
      opacity: 0.65;
    }

    .spark-card--active {
      opacity: 1;
      background: linear-gradient(180deg, rgba(242, 232, 201, 0.9), rgba(255, 249, 234, 0.95));
      color: #6f4330;
      border-color: rgba(200, 109, 74, 0.4);
    }

    .certificate-preview {
      margin-top: 1rem;
      min-height: 14rem;
      border-radius: 1.5rem;
      border: 2px dashed rgba(255,255,255,0.5);
      display: grid;
      place-items: center;
      text-align: center;
      padding: 1rem;
      color: #fff;
    }

    .certificate-preview--ready {
      background: linear-gradient(180deg, #f7f1e3, #f2e8c9);
      border-style: solid;
      color: #6f4330;
    }

    @media (max-width: 920px) {
      .final-page {
        padding: 1rem;
      }

      .spark-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FinalPageComponent {
  readonly assets = FIGMA_ASSETS;
  readonly content = inject(ContentService);
  readonly progress = inject(ProgressService);

  readonly sparks = computed(() => this.content.content()?.rewards.story_sparks ?? []);
  readonly earnedSet = computed(() => new Set(this.progress.progress().earnedRewardIds));
}
