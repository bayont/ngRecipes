import { Directive, forwardRef, Input } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  ValidationErrors
} from '@angular/forms';
import { Observable, of, switchMap, timer } from 'rxjs';
import { RecipeHttpService } from '../services/recipe-http.service';

@Directive({
  selector: '[appRecipeNameValidator]',
  standalone: true,
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => RecipeNameValidatorDirective),
      multi: true
    }
  ]
})
export class RecipeNameValidatorDirective implements AsyncValidator {
  @Input('appRecipeNameValidator') recipeId = '';

  constructor(private recipeHttpService: RecipeHttpService) {}

  validate(control: AbstractControl<string, string>): Observable<ValidationErrors | null> {
    const nameToCheck = control.value;
    return timer(1000).pipe(
      switchMap(() =>
        this.recipeHttpService.fetchRecipes().pipe(
          switchMap((recipes) => {
            return recipes.find(
              (recipe) => recipe._id !== this.recipeId && nameToCheck === recipe.name
            )
              ? of({ 'recipe-name-taken': true })
              : of(null);
          })
        )
      )
    );
  }
}
