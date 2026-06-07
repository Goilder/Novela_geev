import { Routes } from '@angular/router';
import { finalAccessGuard, moduleAccessGuard, transitionAccessGuard } from './core/guards/module-access.guard';
import { AwardsPageComponent } from './pages/awards-page.component';
import { FinalPageComponent } from './pages/final-page.component';
import { HomePageComponent } from './pages/home-page.component';
import { MapPageComponent } from './pages/map-page.component';
import { ModulePageComponent } from './pages/module-page.component';
import { SplashPageComponent } from './pages/splash-page.component';
import { TransitionPageComponent } from './pages/transition-page.component';

export const routes: Routes = [
  {
    path: '',
    component: SplashPageComponent,
    title: 'Пампалче | Начало путешествия',
  },
  {
    path: 'menu',
    component: HomePageComponent,
    title: 'Пампалче | Главное меню',
  },
  {
    path: 'map',
    component: MapPageComponent,
    title: 'Пампалче | Карта модулей',
  },
  {
    path: 'module/:moduleId',
    component: ModulePageComponent,
    canActivate: [moduleAccessGuard],
    title: 'Пампалче | Модуль',
  },
  {
    path: 'transition/:moduleId',
    component: TransitionPageComponent,
    canActivate: [transitionAccessGuard],
    title: 'Пампалче | Следующий шаг',
  },
  {
    path: 'awards',
    component: AwardsPageComponent,
    title: 'Пампалче | Награды',
  },
  {
    path: 'final',
    component: FinalPageComponent,
    canActivate: [finalAccessGuard],
    title: 'Пампалче | Финал',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
