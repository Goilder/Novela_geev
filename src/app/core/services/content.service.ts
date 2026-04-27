import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { GameContent, GameModule, PhraseCatalog } from '../models/game-content.model';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);

  readonly content = signal<GameContent | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly modules = computed(() => this.content()?.modules ?? []);

  async loadContent(force = false): Promise<GameContent> {
    if (this.content() && !force) {
      return this.content() as GameContent;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const payload = await firstValueFrom(
        this.http.get<GameContent>('/pampalche_game_content.json'),
      );
      this.content.set(payload);
      return payload;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось загрузить контент.';
      this.error.set(message);
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  getModuleById(moduleId: string): GameModule | null {
    return this.modules().find((module) => module.id === moduleId) ?? null;
  }

  getRandomPhrase(kind: keyof PhraseCatalog): string {
    const phrases = this.content()?.phrases[kind] ?? [];
    if (!phrases.length) {
      return '';
    }

    const index = Math.floor(Math.random() * phrases.length);
    return phrases[index];
  }
}
