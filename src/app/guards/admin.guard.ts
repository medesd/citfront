import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private route: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!localStorage.getItem('user')) {
      return this.route.createUrlTree(['/signin']);
    } else {
      if (JSON.parse(localStorage.getItem('user')).roles.indexOf('ROLE_ADMIN') !== -1) {
        return true;
      } else {
        return this.route.createUrlTree(['/projectlist']);
      }
    }
    return true;
  }

}
