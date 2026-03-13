import { inject } from "@angular/core";
import { CanMatchFn, Router } from "@angular/router";
import { AuthenticationService } from "@services/authentication/authentication.service";

export const adminOnlyGuard: CanMatchFn = () => {
  const auth = inject(AuthenticationService);
  const router = inject(Router);
  
  // Elegantly redirect to an unauthorized page without downloading the chunk
  return auth.admin ? true : router.parseUrl('/unauthorized');
};