import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/services/content.service';
import { ProgressService } from '../core/services/progress.service';
import { ProgressBannerComponent } from '../shared/components/progress-banner.component';

@Component({
  selector: 'app-map-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ProgressBannerComponent],
  template: `
    @if (content(); as gameContent) {
      <main class="page-shell page-shell--map">
        <app-progress-banner
          eyebrow="Карта модулей"
          title="Маршрут семьи"
          subtitle="Следующий модуль открывается только после завершения предыдущего."
          [sparks]="progressService.state().sparks"
        />

        <section class="map-scene story-card">
          <div class="map-scene__board">
            <img class="map-scene__image" [src]="gameContent.meta.mapBackgroundAsset" alt="Карта путешествия" />

            <div class="map-scene__overlay">
              @for (module of modules(); track module.id) {
                <article
                  class="map-node"
                  [class.is-locked]="!isUnlocked(module.id)"
                  [class.is-completed]="isCompleted(module.id)"
                  [style.left.%]="module.mapPosition?.x"
                  [style.top.%]="module.mapPosition?.y"
                  [style.--card-offset-x.px]="module.mapPosition?.cardOffsetX ?? 0"
                  [style.--card-offset-y.px]="module.mapPosition?.cardOffsetY ?? 44"
                >
                  <div class="map-node__pin">
                    <span>{{ module.order }}</span>
                  </div>

                  <div class="map-node__card">
                    <p class="eyebrow">Модуль {{ module.order }}</p>
                    <h2>{{ module.title }}</h2>

                    <span
                      class="status-chip"
                      [class.status-chip--success]="isCompleted(module.id)"
                      [class.status-chip--muted]="!isUnlocked(module.id)"
                    >
                      {{ isCompleted(module.id) ? 'Пройден' : isUnlocked(module.id) ? 'Открыт' : 'Закрыт' }}
                    </span>

                    @if (isUnlocked(module.id)) {
                      <a class="map-node__cta" [routerLink]="['/module', module.id]">
                        {{ isCompleted(module.id) ? 'Снова' : 'Старт' }}
                      </a>
                    } @else {
                      <button class="map-node__cta map-node__cta--disabled" type="button" disabled>
                        Закрыто
                      </button>
                    }
                  </div>
                </article>
              }
            </div>
          </div>
        </section>
      </main>
    }
  `,
})
export class MapPageComponent {
  private readonly contentService = inject(ContentService);
  protected readonly progressService = inject(ProgressService);

  protected readonly content = this.contentService.content;
  protected readonly modules = computed(() =>
    this.contentService.modules().slice().sort((a, b) => a.order - b.order),
  );

  isUnlocked(moduleId: string): boolean {
    const module = this.contentService.getModuleById(moduleId);
    if (!module) {
      return false;
    }

    return this.progressService.isModuleUnlocked(module, this.modules());
  }

  isCompleted(moduleId: string): boolean {
    return this.progressService.isModuleCompleted(moduleId);
  }
}
