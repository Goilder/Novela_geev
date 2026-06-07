import { Injectable, signal } from '@angular/core';
import { GameModule } from '../models/game-content.model';
import { ModuleProgressState, ProgressState } from '../models/progress.model';

const STORAGE_KEY = 'pampalche-progress-v1';

function createDefaultModuleProgress(): ModuleProgressState {
  return {
    currentStepIndex: 0,
    completed: false,
    answers: {},
    completedAt: null,
  };
}

function createDefaultProgress(): ProgressState {
  return {
    startedAt: null,
    updatedAt: null,
    sparks: 0,
    badges: [],
    completedModuleIds: [],
    familyProfile: {
      childName: '',
      parentName: '',
    },
    moduleProgress: {},
  };
}

@Injectable({ providedIn: 'root' })
export class ProgressService {
  readonly state = signal<ProgressState>(createDefaultProgress());

  constructor() {
    this.hydrate();
  }

  hydrate(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const rawState = window.localStorage.getItem(STORAGE_KEY);
    if (!rawState) {
      return;
    }

    try {
      const parsed = JSON.parse(rawState) as ProgressState;
      this.state.set({
        ...createDefaultProgress(),
        ...parsed,
        moduleProgress: parsed.moduleProgress ?? {},
      });
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  reset(): void {
    this.state.set(createDefaultProgress());
    this.persist();
  }

  saveFamilyProfile(childName: string, parentName: string): void {
    this.state.update((state) => ({
      ...state,
      startedAt: state.startedAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      familyProfile: {
        childName: childName.trim(),
        parentName: parentName.trim(),
      },
    }));
    this.persist();
  }

  getModuleState(moduleId: string): ModuleProgressState {
    return this.state().moduleProgress[moduleId] ?? createDefaultModuleProgress();
  }

  getStepAnswer<T>(moduleId: string, stepId: string): T | null {
    const moduleState = this.getModuleState(moduleId);
    return (moduleState.answers[stepId] as T | undefined) ?? null;
  }

  updateStepAnswer(moduleId: string, stepId: string, answer: unknown): void {
    this.state.update((state) => {
      const moduleState = state.moduleProgress[moduleId] ?? createDefaultModuleProgress();
      return {
        ...state,
        startedAt: state.startedAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        moduleProgress: {
          ...state.moduleProgress,
          [moduleId]: {
            ...moduleState,
            answers: {
              ...moduleState.answers,
              [stepId]: answer,
            },
          },
        },
      };
    });
    this.persist();
  }

  updateCurrentStep(moduleId: string, currentStepIndex: number): void {
    this.state.update((state) => {
      const moduleState = state.moduleProgress[moduleId] ?? createDefaultModuleProgress();
      return {
        ...state,
        startedAt: state.startedAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        moduleProgress: {
          ...state.moduleProgress,
          [moduleId]: {
            ...moduleState,
            currentStepIndex,
          },
        },
      };
    });
    this.persist();
  }

  completeModule(module: GameModule): void {
    const state = this.state();
    if (state.completedModuleIds.includes(module.id)) {
      return;
    }

    this.state.update((previousState) => {
      const moduleState =
        previousState.moduleProgress[module.id] ?? createDefaultModuleProgress();

      return {
        ...previousState,
        startedAt: previousState.startedAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sparks: previousState.sparks + module.reward.sparks,
        badges: Array.from(
          new Set([...previousState.badges, module.reward.badgeId]),
        ),
        completedModuleIds: [...previousState.completedModuleIds, module.id],
        moduleProgress: {
          ...previousState.moduleProgress,
          [module.id]: {
            ...moduleState,
            currentStepIndex: module.steps.length,
            completed: true,
            completedAt: new Date().toISOString(),
          },
        },
      };
    });
    this.persist();
  }

  isModuleUnlocked(module: GameModule, modules: GameModule[]): boolean {
    if (module.order === 1) {
      return true;
    }

    const requiredModules = modules.filter((item) => item.order < module.order);
    return requiredModules.every((item) =>
      this.state().completedModuleIds.includes(item.id),
    );
  }

  isModuleCompleted(moduleId: string): boolean {
    return this.state().completedModuleIds.includes(moduleId);
  }

  areAllModulesCompleted(modules: GameModule[]): boolean {
    return modules.every((module) => this.isModuleCompleted(module.id));
  }

  getModulePhotoEntries(): string[] {
    return Object.values(this.state().moduleProgress)
      .flatMap((moduleState) => Object.values(moduleState.answers))
      .filter((answer): answer is { photoDataUrl: string } => {
        return !!answer && typeof answer === 'object' && 'photoDataUrl' in answer;
      })
      .map((answer) => answer.photoDataUrl)
      .filter(Boolean);
  }

  getPhotoGalleryEntries(): Array<{ photoDataUrl: string; caption: string }> {
    return Object.values(this.state().moduleProgress)
      .flatMap((moduleState) => Object.values(moduleState.answers))
      .filter(
        (answer): answer is { photoDataUrl: string; caption?: string } =>
          !!answer && typeof answer === 'object' && 'photoDataUrl' in answer,
      )
      .map((answer) => ({
        photoDataUrl: answer.photoDataUrl,
        caption: answer.caption?.trim() ?? '',
      }))
      .filter((entry) => !!entry.photoDataUrl);
  }

  private persist(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state()));
  }
}
