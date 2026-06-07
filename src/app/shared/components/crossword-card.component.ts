import { CommonModule } from '@angular/common';
import { Component, computed, effect, input, output, signal } from '@angular/core';
import { CrosswordStep, CrosswordWord } from '../../core/models/game-content.model';

interface CrosswordAnswer {
  entries: Record<string, string>;
  solvedWordIds: string[];
}

interface GridCell {
  row: number;
  col: number;
  solution: string;
  wordIds: string[];
}

@Component({
  selector: 'app-crossword-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="step-card story-card">
      @if (step().illustrationAsset) {
        <div class="scene-cover">
          <img [src]="step().illustrationAsset" [alt]="step().title" />
        </div>
      }
      <div class="step-card__body">
        <p class="eyebrow">Кроссворд</p>
        <h2>{{ step().title }}</h2>
        <p class="lede">{{ step().prompt }}</p>

        <div class="crossword-meta">
          <span class="status-chip">Решено слов: {{ solvedCount() }} / {{ step().words.length }}</span>
          @if (statusMessage()) {
            <span class="status-chip status-chip--warm">{{ statusMessage() }}</span>
          }
        </div>

        <div class="crossword-layout">
          <div class="crossword-grid" [style.--crossword-cols]="step().grid.cols">
            @for (row of gridRows(); track row.rowIndex) {
              <div class="crossword-grid__row">
                @for (cell of row.cells; track cellKey(cell.row, cell.col)) {
                  @if (cell.solution) {
                    <input
                      class="crossword-cell"
                      [class.crossword-cell--active]="isCellActive(cell)"
                      [class.crossword-cell--solved]="isCellSolved(cell)"
                      [value]="valueAt(cell.row, cell.col)"
                      maxlength="1"
                      (input)="updateEntry(cell.row, cell.col, $event)"
                    />
                  } @else {
                    <div class="crossword-cell crossword-cell--empty"></div>
                  }
                }
              </div>
            }
          </div>

          <div class="crossword-clues">
            <h3>Подсказки</h3>
            <div class="clue-list">
              @for (word of step().words; track word.id) {
                <button
                  class="clue-item"
                  type="button"
                  [class.is-active]="activeWordId() === word.id"
                  [class.is-solved]="solvedWordIds().includes(word.id)"
                  (click)="activeWordId.set(word.id)"
                >
                  @if (word.hintAsset) {
                    <img class="clue-item__thumb" [src]="word.hintAsset" [alt]="word.clue" />
                  }
                  <strong>{{ word.direction === 'across' ? 'По горизонтали' : 'По вертикали' }}</strong>
                  <span>{{ word.clue }}</span>
                </button>
              }
            </div>

            <div class="crossword-actions">
              <button class="btn btn--ghost" type="button" (click)="checkActiveWord()">
                Проверить слово
              </button>
              <button class="btn btn--primary" type="button" [disabled]="!allSolved()" (click)="confirm()">
                {{ step().continueLabel || 'Продолжить' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  `,
})
export class CrosswordCardComponent {
  readonly step = input.required<CrosswordStep>();
  readonly savedAnswer = input<CrosswordAnswer | null>(null);
  readonly completed = output<CrosswordAnswer>();

  readonly entries = signal<Record<string, string>>({});
  readonly solvedWordIds = signal<string[]>([]);
  readonly statusMessage = signal('');
  readonly activeWordId = signal('');

  readonly gridCells = computed(() => {
    const grid = new Map<string, GridCell>();

    for (const word of this.step().words) {
      const answer = word.answer.toLocaleUpperCase('ru-RU');
      for (let index = 0; index < answer.length; index += 1) {
        const row = word.row + (word.direction === 'down' ? index : 0);
        const col = word.col + (word.direction === 'across' ? index : 0);
        const key = this.cellKey(row, col);
        const existingCell = grid.get(key);

        if (existingCell) {
          existingCell.wordIds.push(word.id);
          continue;
        }

        grid.set(key, {
          row,
          col,
          solution: answer[index],
          wordIds: [word.id],
        });
      }
    }

    return grid;
  });

  readonly gridRows = computed(() => {
    const rows: Array<{ rowIndex: number; cells: GridCell[] }> = [];
    const { rows: rowCount, cols: colCount } = this.step().grid;
    for (let row = 0; row < rowCount; row += 1) {
      const rowCells: GridCell[] = [];
      for (let col = 0; col < colCount; col += 1) {
        rowCells.push(
          this.gridCells().get(this.cellKey(row, col)) ?? {
            row,
            col,
            solution: '',
            wordIds: [],
          },
        );
      }
      rows.push({ rowIndex: row, cells: rowCells });
    }
    return rows;
  });

  readonly solvedCount = computed(() => this.solvedWordIds().length);
  readonly allSolved = computed(() => this.solvedWordIds().length === this.step().words.length);

  constructor() {
    effect(() => {
      const savedAnswer = this.savedAnswer();
      const words = this.step().words;
      this.entries.set(savedAnswer?.entries ?? {});
      this.solvedWordIds.set(savedAnswer?.solvedWordIds ?? []);
      this.activeWordId.set(words[0]?.id ?? '');
      this.statusMessage.set('');
    });
  }

  cellKey(row: number, col: number): string {
    return `${row}-${col}`;
  }

  valueAt(row: number, col: number): string {
    return this.entries()[this.cellKey(row, col)] ?? '';
  }

  updateEntry(row: number, col: number, event: Event): void {
    const value = (event.target as HTMLInputElement).value.slice(-1).toLocaleUpperCase('ru-RU');

    this.entries.update((entries) => ({
      ...entries,
      [this.cellKey(row, col)]: value,
    }));
    this.statusMessage.set('');
  }

  isCellActive(cell: GridCell): boolean {
    return cell.wordIds.includes(this.activeWordId());
  }

  isCellSolved(cell: GridCell): boolean {
    return cell.wordIds.some((wordId) => this.solvedWordIds().includes(wordId));
  }

  checkActiveWord(): void {
    const activeWord = this.step().words.find((word) => word.id === this.activeWordId());
    if (!activeWord) {
      return;
    }

    if (this.matchesWord(activeWord)) {
      this.solvedWordIds.update((wordIds) =>
        wordIds.includes(activeWord.id) ? wordIds : [...wordIds, activeWord.id],
      );
      this.fillCorrectWord(activeWord);
      this.statusMessage.set(`Слово «${activeWord.answer}» решено.`);
      const nextWord = this.step().words.find((word) => !this.solvedWordIds().includes(word.id));
      if (nextWord) {
        this.activeWordId.set(nextWord.id);
      }
      return;
    }

    this.statusMessage.set('Пока не сходится. Попробуйте еще раз или перечитайте подсказку.');
  }

  confirm(): void {
    this.completed.emit({
      entries: this.entries(),
      solvedWordIds: this.solvedWordIds(),
    });
  }

  private matchesWord(word: CrosswordWord): boolean {
    const answer = word.answer.toLocaleUpperCase('ru-RU');
    for (let index = 0; index < answer.length; index += 1) {
      const row = word.row + (word.direction === 'down' ? index : 0);
      const col = word.col + (word.direction === 'across' ? index : 0);
      const actualValue = this.valueAt(row, col);
      if (actualValue !== answer[index]) {
        return false;
      }
    }
    return true;
  }

  private fillCorrectWord(word: CrosswordWord): void {
    const answer = word.answer.toLocaleUpperCase('ru-RU');
    const nextEntries = { ...this.entries() };
    for (let index = 0; index < answer.length; index += 1) {
      const row = word.row + (word.direction === 'down' ? index : 0);
      const col = word.col + (word.direction === 'across' ? index : 0);
      nextEntries[this.cellKey(row, col)] = answer[index];
    }
    this.entries.set(nextEntries);
  }
}
