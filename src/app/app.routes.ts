import { Routes } from '@angular/router';

import { FinalPageComponent } from './pages/final-page.component';
import { HomePageComponent } from './pages/home-page.component';
import { ModuleMapPageComponent } from './pages/module-map-page.component';
import { ModulePageComponent } from './pages/module-page.component';
import { RewardsPageComponent } from './pages/rewards-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'map', component: ModuleMapPageComponent },
  { path: 'modules/:moduleId', component: ModulePageComponent },
  { path: 'rewards', component: RewardsPageComponent },
  { path: 'final', component: FinalPageComponent },
  { path: '**', redirectTo: '' }
];
