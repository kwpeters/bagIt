import {Injectable} from "@angular/core";
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {ModelUserService} from "./model-user.service";

@Injectable({providedIn: "root"})
export class LoginGuard implements CanActivate
{
    private _modelUserService: ModelUserService;


    public constructor(router: Router, modelUserService: ModelUserService)
    {
        this._modelUserService = modelUserService;
    }

    public canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean
    {
        return this._modelUserService.getUser()
        .then((firebaseUser) => {
            return !!firebaseUser;
        });
    }
}
