export interface GameContent {
  meta: GameMeta;
  phrases: PhraseCatalog;
  awards: AwardDefinition[];
  finale: FinaleContent;
  modules: GameModule[];
}

export interface GameMeta {
  title: string;
  subtitle: string;
  description: string;
  homeBackgroundAsset: string;
  mapBackgroundAsset: string;
  awardsBackgroundAsset: string;
  finalBackgroundAsset: string;
  highlights: string[];
}

export interface PhraseCatalog {
  correct: string[];
  incorrect: string[];
  encouraging: string[];
}

export interface AwardDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface FinaleContent {
  title: string;
  subtitle: string;
  certificateTitle: string;
  certificateLine: string;
  closingLines: string[];
}

export interface GameModule {
  id: string;
  order: number;
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  coverAsset: string;
  accent: string;
  mapPosition?: MapPosition;
  reward: ModuleReward;
  completion: ModuleCompletion;
  steps: ModuleStep[];
}

export interface MapPosition {
  x: number;
  y: number;
  cardOffsetX?: number;
  cardOffsetY?: number;
}

export interface ModuleReward {
  sparks: number;
  badgeId: string;
}

export interface ModuleCompletion {
  title: string;
  message: string;
  buttonLabel: string;
}

export interface BaseStep {
  id: string;
  type:
    | 'dialogue'
    | 'choice'
    | 'quiz'
    | 'reflection'
    | 'video'
    | 'crossword'
    | 'photo';
  title: string;
  description?: string;
  continueLabel?: string;
}

export interface DialogueStep extends BaseStep {
  type: 'dialogue';
  sceneAsset?: string;
  lines: DialogueLine[];
}

export interface DialogueLine {
  speaker: string;
  role: 'guide' | 'family';
  text: string;
}

export interface ChoiceStep extends BaseStep {
  type: 'choice';
  prompt: string;
  options: ChoiceOption[];
}

export interface ChoiceOption {
  id: string;
  label: string;
  response: string;
}

export interface QuizStep extends BaseStep {
  type: 'quiz';
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
  feedback: {
    correct: string;
    incorrect: string;
  };
}

export interface QuizOption {
  id: string;
  label: string;
}

export interface ReflectionStep extends BaseStep {
  type: 'reflection';
  prompt: string;
  fields: ReflectionField[];
}

export interface ReflectionField {
  id: string;
  label: string;
  placeholder: string;
  maxLength?: number;
}

export interface VideoStep extends BaseStep {
  type: 'video';
  prompt: string;
  posterAsset?: string;
  videoUrl?: string;
  videoEmbedUrl?: string;
  tips?: string[];
}

export interface CrosswordStep extends BaseStep {
  type: 'crossword';
  prompt: string;
  grid: CrosswordGrid;
  words: CrosswordWord[];
}

export interface CrosswordGrid {
  rows: number;
  cols: number;
}

export interface CrosswordWord {
  id: string;
  clue: string;
  answer: string;
  row: number;
  col: number;
  direction: 'across' | 'down';
}

export interface PhotoStep extends BaseStep {
  type: 'photo';
  prompt: string;
  captionLabel: string;
  captionPlaceholder: string;
}

export type ModuleStep =
  | DialogueStep
  | ChoiceStep
  | QuizStep
  | ReflectionStep
  | VideoStep
  | CrosswordStep
  | PhotoStep;
