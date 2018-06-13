import {Component, OnInit} from "@angular/core";
import {Router}            from "@angular/router";
import {LoginService}      from "../login.service";
import {Observable}        from "rxjs";
import * as firebase       from "firebase";


@Component(
    {
        selector:    "app-main",
        templateUrl: "./main.component.html",
        styleUrls:   ["./main.component.css"]
    }
)
export class MainComponent implements OnInit
{

    private _router: Router;
    private _loginService: LoginService;


    constructor(router: Router, loginService: LoginService)
    {
        this._router       = router;
        this._loginService = loginService;
    }


    public get currentUser$(): Observable<firebase.User | null>
    {
        return this._loginService.currentUser$;
    }


    public ngOnInit(): void
    {
    }


    public signOut(): void
    {
        this._loginService.logout();
        this._router.navigate([""]);
    }

}
