import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';

import { FIGMA_ASSETS } from '../figma-assets';
import { ContentService } from '../services/content.service';
import { ProgressService } from '../services/progress.service';

@Component({
  standalone: true,
  selector: 'app-rewards-page',
  imports: [CommonModule],
  template: `
    <section class="rewards-page" *ngIf="content.content() as game" [style.background-image]="'url(' + assets.familyPlatform + ')'">
      <div class="rewards-page__panel">
        <header class="rewards-page__header">
          <h1>Награды семьи</h1>
          <p>Здесь собираются все шаги пути: разговор, творчество, забота и общий труд.</p>
        </header>

        <div class="reward-grid">
          <article class="reward-card" *ngFor="let reward of rewardCards()"
            [class.reward-card--earned]="earnedSet().has(reward.id)">
            <div class="reward-card__icon">{{ earnedSet().has(reward.id) ? '✦' : '○' }}</div>
            <h2>{{ reward.title }}</h2>
            <p>{{ reward.text }}</p>
            <div class="reward-card__status">
              {{ earnedSet().has(reward.id) ? 'Получено' : 'Еще впереди' }}
            </div>
          </article>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .rewards-page {
      min-height: calc(100dvh - 80px);
      background-position: center;
      background-size: cover;
      padding: 3rem 2rem;
    }

    .rewards-page__panel {
      max-width: 72rem;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.24);
      backdrop-filter: blur(14px);
      border: 1px solid rgba(255, 255, 255, 0.45);
      border-radius: 2rem;
      padding: 1.5rem;
    }

    .rewards-page__header {
      color: #fff;
      text-align: center;
      margin-bottom: 1rem;
    }

    .reward-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
    }

    .reward-card {
      padding: 1.35rem;
      border-radius: 1.6rem;
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.5);
      opacity: 0.78;
      color: #173100;
    }

    .reward-card--earned {
      opacity: 1;
      box-shadow: 0 16px 36px rgba(182, 69, 58, 0.12);
      border-color: rgba(182, 69, 58, 0.28);
    }

    .reward-card__icon {
      width: 3rem;
      height: 3rem;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: rgba(182, 69, 58, 0.1);
      color: #b6453a;
      font-size: 1.35rem;
      margin-bottom: 0.75rem;
    }

    .reward-card__status {
      margin-top: 0.85rem;
      font-weight: 700;
      color: #6f5f55;
    }

    @media (max-width: 980px) {
      .rewards-page {
        padding: 1rem;
      }

      .reward-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RewardsPageComponent {
  readonly assets = FIGMA_ASSETS;
  readonly content = inject(ContentService);
  readonly progress = inject(ProgressService);

  readonly rewardCards = computed(() => {
    const rewards = this.content.content()?.rewards;
    if (!rewards) {
      return [];
    }

    return [
      rewards.participation,
      rewards.discussion,
      rewards.kind_answers,
      rewards.creativity,
      ...rewards.story_sparks,
      rewards.all_modules
    ];
  });

  readonly earnedSet = computed(() => new Set(this.progress.progress().earnedRewardIds));
}
