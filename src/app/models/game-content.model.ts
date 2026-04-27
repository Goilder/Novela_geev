export interface GameProject {
  id: string;
  title: string;
  language: string;
  audience: {
    children_age: string;
    co_play: string;
  };
  themes: string[];
  main_character: string;
}

export interface StoryStep {
  id: string;
  title: string;
  player_goal: string;
  reward?: string;
}

export interface RewardCard {
  id: string;
  title: string;
  text: string;
}

export interface RewardCollection {
  participation: RewardCard;
  discussion: RewardCard;
  kind_answers: RewardCard;
  creativity: RewardCard;
  all_modules: RewardCard;
  story_sparks: RewardCard[];
}

export interface UiTexts {
  buttons: Record<string, string>;
  labels: Record<string, string>;
  notifications: Record<string, string>;
  tooltips: Record<string, string>;
}

export interface ModuleQuestion {
  id: string;
  question_child?: string;
  question_parent?: string;
  question?: string;
  pampalche_followup?: string;
}

export interface ModuleTestQuestion {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  correct_feedback: string;
  wrong_feedback: string;
}

export interface ModuleTest {
  title: string;
  instruction: string;
  questions: ModuleTestQuestion[];
}

export interface BranchingChoice {
  id: string;
  prompt: string;
  options: Array<{
    text: string;
    response: string;
  }>;
}

export interface CrosswordEntry {
  id: number;
  clue: string;
  answer: string;
  hint: string;
  success: string;
  error: string;
}

export interface ModuleBase {
  id: string;
  title: string;
  subtitle: string;
}

export interface ModuleOne extends ModuleBase {
  intro_scene: {
    narration: string;
    pampalche: string[];
  };
  post_booktrailer_block: {
    pampalche: string[];
    family_discussion_questions: ModuleQuestion[];
  };
  test: ModuleTest;
  branching_choices: BranchingChoice[];
  creative_task: {
    title: string;
    instruction: string;
    pampalche: string[];
  };
  completion: {
    pampalche: string[];
    reward_id: string;
  };
}

export interface ModuleTwo extends ModuleBase {
  intro_scene: { narration: string; pampalche: string[] };
  motivation: { story: string; pampalche: string[] };
  materials: string[];
  step_by_step: string[];
  reflection_questions: string[];
  good_luck_task: {
    title: string;
    instruction: string;
    pampalche: string[];
  };
  reward: RewardCard;
  completion: { pampalche: string[] };
}

export interface ModuleThree extends ModuleBase {
  intro_scene: { narration: string; pampalche: string[] };
  crossword: {
    title: string;
    entries: CrosswordEntry[];
  };
  global_feedback: {
    correct_random: string[];
    wrong_random: string[];
  };
  final_reflection: {
    pampalche: string[];
    question: string;
    followup: string;
  };
  city_arrival_task: {
    title: string;
    instruction: string;
    output_format: string;
  };
  completion: {
    pampalche: string[];
    reward_id: string;
  };
}

export interface ModuleFour extends ModuleBase {
  intro_scene: { narration: string; pampalche: string[] };
  dish_description: {
    name: string;
    note: string;
    why_this_dish: string;
  };
  ingredients: string[];
  step_by_step: string[];
  mini_tasks: Array<{
    id: string;
    task: string;
  }>;
  family_final_block: {
    title: string;
    questions: string[];
    ritual: string;
  };
  completion: {
    pampalche: string[];
    reward_id: string;
  };
  festive_ending: {
    pampalche: string[];
  };
}

export type GameModule = ModuleOne | ModuleTwo | ModuleThree | ModuleFour;

export interface AssetManifest {
  project: {
    id: string;
    title: string;
    source_story_file: string;
  };
  style: {
    visual_formula: string;
    palette: Record<string, string[]>;
  };
  assets: Array<{
    id: string;
    category: string;
    purpose: string;
    style: string;
    composition: string;
    format: string;
    transparent_background: boolean;
    prompt: string;
  }>;
}

export interface GameContent {
  project: GameProject;
  general_story: {
    logline: string;
    premise: string;
    stakes: string;
    tone: string[];
    educational_goals: string[];
  };
  main_scenario_cycle: {
    steps: StoryStep[];
  };
  pampalche_lines: {
    greeting: string[];
    game_start: string[];
    module_transition: Record<string, string>;
    praise: string[];
    hints: string[];
    soft_error: string[];
    module_completion: string[];
    finale: string[];
  };
  modules: GameModule[];
  rewards: RewardCollection;
  ui_texts: UiTexts;
}

export interface ModuleProgressData {
  quizAnswers?: Record<string, number>;
  discussionAnswers?: Record<string, string>;
  branchChoice?: string;
  creativeAnswer?: string;
  craftNotes?: Record<string, string>;
  craftPhotoUrl?: string;
  crosswordAnswers?: Record<string, string>;
  crosswordSolved?: string[];
  cookingNotes?: Record<string, string>;
}

export interface PlayerProgress {
  unlockedModules: string[];
  completedModules: string[];
  earnedRewardIds: string[];
  activeModuleId: string | null;
  moduleData: Record<string, ModuleProgressData>;
  lastUpdated: string | null;
}
