import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ContentService } from './core/services/content.service';
import { ProgressService } from './core/services/progress.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly sparks = computed(() => this.progressService.state().sparks);
  protected readonly loading = computed(() => this.contentService.loading());

  constructor(
    protected readonly contentService: ContentService,
    protected readonly progressService: ProgressService,
  ) {
    void this.contentService.loadContent();
  }
}
