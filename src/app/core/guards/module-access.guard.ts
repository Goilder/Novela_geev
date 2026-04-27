import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ContentService } from '../services/content.service';
import { ProgressService } from '../services/progress.service';

export const moduleAccessGuard: CanActivateFn = async (route) => {
  const contentService = inject(ContentService);
  const progressService = inject(ProgressService);
  const router = inject(Router);

  await contentService.loadContent();
  const moduleId = route.paramMap.get('moduleId') ?? '';
  const module = contentService.getModuleById(moduleId);

  if (!module) {
    return router.parseUrl('/');
  }

  if (!progressService.isModuleUnlocked(module, contentService.modules())) {
    return router.parseUrl('/map');
  }

  return true;
};

export const transitionAccessGuard: CanActivateFn = async (route) => {
  const contentService = inject(ContentService);
  const progressService = inject(ProgressService);
  const router = inject(Router);

  await contentService.loadContent();
  const moduleId = route.paramMap.get('moduleId') ?? '';
  const module = contentService.getModuleById(moduleId);

  if (!module || !progressService.isModuleCompleted(moduleId)) {
    return router.parseUrl('/map');
  }

  return true;
};

export const finalAccessGuard: CanActivateFn = async () => {
  const contentService = inject(ContentService);
  const progressService = inject(ProgressService);
  const router = inject(Router);

  await contentService.loadContent();

  if (!progressService.areAllModulesCompleted(contentService.modules())) {
    return router.parseUrl('/awards');
  }

  return true;
};
