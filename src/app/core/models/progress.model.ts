export interface FamilyProfile {
  childName: string;
  parentName: string;
}

export interface ModuleProgressState {
  currentStepIndex: number;
  completed: boolean;
  answers: Record<string, unknown>;
  completedAt: string | null;
}

export interface ProgressState {
  startedAt: string | null;
  updatedAt: string | null;
  sparks: number;
  badges: string[];
  completedModuleIds: string[];
  familyProfile: FamilyProfile;
  moduleProgress: Record<string, ModuleProgressState>;
}
