import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ProgressBannerComponent } from '../shared/components/progress-banner.component';
import { ContentService } from '../core/services/content.service';
import { ProgressService } from '../core/services/progress.service';

@Component({
  selector: 'app-transition-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ProgressBannerComponent],
  template: `
    @if (module(); as currentModule) {
      <main class="page-shell">
        <app-progress-banner
          eyebrow="Переход"
          [title]="currentModule.completion.title"
          [subtitle]="currentModule.completion.message"
          [sparks]="progressService.state().sparks"
        />

        <section class="story-card transition-card">
          <img [src]="currentModule.coverAsset" [alt]="currentModule.title" />
          <div class="transition-card__body">
            <p class="eyebrow">Пампалче говорит</p>
            <h2>{{ currentModule.title }} завершен</h2>
            <p>{{ currentModule.completion.message }}</p>

            <div class="stat-grid">
              <div class="stat-tile">
                <strong>+{{ currentModule.reward.sparks }}</strong>
                <span>искр за модуль</span>
              </div>
              <div class="stat-tile">
                <strong>{{ progressService.state().badges.length }}</strong>
                <span>бейджей открыто</span>
              </div>
            </div>

            <div class="button-row">
              <button class="btn btn--primary" type="button" (click)="goNext()">
                {{ nextModule() ? currentModule.completion.buttonLabel : 'Перейти к финалу' }}
              </button>
              <a class="btn btn--ghost" routerLink="/awards">Смотреть награды</a>
            </div>
          </div>
        </section>
      </main>
    }
  `,
})
export class TransitionPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly contentService = inject(ContentService);
  protected readonly progressService = inject(ProgressService);

  private readonly moduleId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('moduleId') ?? '')),
    { initialValue: '' },
  );

  protected readonly module = computed(() => this.contentService.getModuleById(this.moduleId()));
  protected readonly nextModule = computed(() => {
    const module = this.module();
    if (!module) {
      return null;
    }

    return this.contentService
      .modules()
      .find((item) => item.order === module.order + 1) ?? null;
  });

  goNext(): void {
    const nextModule = this.nextModule();
    if (nextModule) {
      void this.router.navigate(['/module', nextModule.id]);
      return;
    }

    void this.router.navigate(['/final']);
  }
}
