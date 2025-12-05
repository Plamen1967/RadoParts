import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

getMessage( hint: string, error: ValidationErrors | null) {
  if (error?.['required']) return `${hint} е задължителнa информация.`;
  if (error?.['maxlength']) return `${hint} е твърде дълго (максимум ${error['maxlength']?.requiredLength}).`;
  if (error?.['minlength']) return `${hint} е твърде късо (минимално ${error['minlength']?.requiredLength}).`;
  if (error?.['pattern']) return `${hint} трябва да се число.`;
  if (error?.['missingName']) return `${hint} не може да бъде намерено.`;
  if (error?.['min']) return `${hint} трябва да е избран.`;

  return '';
}

logError(error: string) {
  console.log(error)
}
}
