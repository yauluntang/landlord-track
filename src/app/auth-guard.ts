import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {UserService} from './service/user.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private userService: UserService) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {

        const loggedIn = this.userService.userData !== undefined && this.userService.userData !== null;

        if (!loggedIn) {
            this.router.navigate(['/']);
        }

        return loggedIn;
    }
}