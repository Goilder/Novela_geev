import { Injectable, computed, effect, signal } from '@angular/core';

import { ModuleProgressData, PlayerProgress } from '../models/game-content.model';

const STORAGE_KEY = 'pampalche-progress-v1';

function createDefaultProgress(): PlayerProgress {
  return {
    unlockedModules: ['module_1'],
    completedModules: [],
    earnedRewardIds: ['badge_start'],
    activeModuleId: null,
    moduleData: {},
    lastUpdated: null
  };
}

@Injectable({ providedIn: 'root' })
export class ProgressService {
  readonly progress = signal<PlayerProgress>(createDefaultProgress());
  readonly completedModulesCount = computed(() => this.progress().completedModules.length);
  readonly allModulesCompleted = computed(() => this.completedModulesCount() === 4);

  constructor() {
    this.restore();
    effect(() => {
      const snapshot = this.progress();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    });
  }

  restore(): void {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }

    try {
      this.progress.set({
        ...createDefaultProgress(),
        ...JSON.parse(raw) as PlayerProgress
      });
    } catch {
      this.progress.set(createDefaultProgress());
    }
  }

  reset(): void {
    this.progress.set(createDefaultProgress());
  }

  isModuleUnlocked(moduleId: string): boolean {
    return this.progress().unlockedModules.includes(moduleId);
  }

  isModuleCompleted(moduleId: string): boolean {
    return this.progress().completedModules.includes(moduleId);
  }

  updateActiveModule(moduleId: string): void {
    this.progress.update((progress) => ({
      ...progress,
      activeModuleId: moduleId,
      lastUpdated: new Date().toISOString()
    }));
  }

  updateModuleData(moduleId: string, patch: Partial<ModuleProgressData>): void {
    this.progress.update((progress) => ({
      ...progress,
      activeModuleId: moduleId,
      lastUpdated: new Date().toISOString(),
      moduleData: {
        ...progress.moduleData,
        [moduleId]: {
          ...(progress.moduleData[moduleId] ?? {}),
          ...patch
        }
      }
    }));
  }

  addReward(rewardId: string): void {
    this.progress.update((progress) => ({
      ...progress,
      earnedRewardIds: progress.earnedRewardIds.includes(rewardId)
        ? progress.earnedRewardIds
        : [...progress.earnedRewardIds, rewardId],
      lastUpdated: new Date().toISOString()
    }));
  }

  completeModule(moduleId: string, rewardId?: string, nextModuleId?: string | null): void {
    this.progress.update((progress) => ({
      ...progress,
      completedModules: progress.completedModules.includes(moduleId)
        ? progress.completedModules
        : [...progress.completedModules, moduleId],
      unlockedModules: nextModuleId && !progress.unlockedModules.includes(nextModuleId)
        ? [...progress.unlockedModules, nextModuleId]
        : progress.unlockedModules,
      earnedRewardIds: rewardId && !progress.earnedRewardIds.includes(rewardId)
        ? [...progress.earnedRewardIds, rewardId]
        : progress.earnedRewardIds,
      activeModuleId: nextModuleId ?? moduleId,
      lastUpdated: new Date().toISOString()
    }));
  }
}
