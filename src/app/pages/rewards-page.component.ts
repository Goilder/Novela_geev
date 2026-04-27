import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';

import { ContentService } from '../services/content.service';
import { ProgressService } from '../services/progress.service';

@Component({
  standalone: true,
  selector: 'app-rewards-page',
  imports: [CommonModule],
  template: `
    <section class="rewards-page" *ngIf="content.content() as game">
      <header class="rewards-page__header card">
        <span class="eyebrow">Награды</span>
        <h1>Искры и семейные достижения</h1>
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
    </section>
  `,
  styles: [`
    .rewards-page {
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

    .reward-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
    }

    .reward-card {
      padding: 1.35rem;
      border-radius: 1.6rem;
      background: rgba(255, 250, 242, 0.8);
      border: 1px solid rgba(138, 90, 60, 0.14);
      opacity: 0.78;
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
      .reward-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RewardsPageComponent {
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
