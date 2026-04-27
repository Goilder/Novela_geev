import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AssetManifest, GameContent, GameModule } from '../models/game-content.model';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);

  readonly content = signal<GameContent | null>(null);
  readonly manifest = signal<AssetManifest | null>(null);
  readonly loading = signal(false);
  readonly ready = computed(() => Boolean(this.content() && this.manifest()));

  async load(): Promise<void> {
    if (this.ready() || this.loading()) {
      return;
    }

    this.loading.set(true);

    try {
      const [content, manifest] = await Promise.all([
        firstValueFrom(this.http.get<GameContent>('content/pampalche_game_content.json')),
        firstValueFrom(this.http.get<AssetManifest>('content/pampalche_asset_manifest.json'))
      ]);

      this.content.set(content);
      this.manifest.set(manifest);
    } finally {
      this.loading.set(false);
    }
  }

  moduleById(moduleId: string): GameModule | undefined {
    return this.content()?.modules.find((module) => module.id === moduleId);
  }

  nextModuleId(moduleId: string): string | null {
    const modules = this.content()?.modules ?? [];
    const index = modules.findIndex((module) => module.id === moduleId);
    return index >= 0 && index < modules.length - 1 ? modules[index + 1].id : null;
  }
}
