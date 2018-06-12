import {Injectable} from "@angular/core";
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {LoginService} from "./login.service";

@Injectable({providedIn: "root"})
export class LoginGuard implements CanActivate
{
    private _loginService: LoginService;


    public constructor(router: Router, loginService: LoginService)
    {
        this._loginService = loginService;
    }

    public canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean
    {
        return this._loginService.getUser()
        .then((firebaseUser) => {
            return !!firebaseUser;
        });
    }
}
