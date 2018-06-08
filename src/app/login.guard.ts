import {Injectable} from "@angular/core";
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {LoginService} from "./login.service";

@Injectable({providedIn: "root"})
export class LoginGuard implements CanActivate
{
    private _loginService: LoginService;

    public constructor(loginService: LoginService)
    {
        this._loginService = loginService;
    }

    public canActivate(
        // next: ActivatedRouteSnapshot,
        // state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean
    {
        return true;
    }
}
