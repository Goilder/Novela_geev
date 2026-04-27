import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { ContentService } from './core/services/content.service';
import { ProgressService } from './core/services/progress.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        {
          provide: ContentService,
          useValue: {
            content: signal(null),
            loading: signal(true),
            loadContent: () => Promise.resolve(),
          },
        },
        {
          provide: ProgressService,
          useValue: {
            state: signal({
              sparks: 0,
              badges: [],
              completedModuleIds: [],
              familyProfile: {
                childName: '',
                parentName: '',
              },
            }),
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render loading title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Загружаем семейное путешествие');
  });
});
