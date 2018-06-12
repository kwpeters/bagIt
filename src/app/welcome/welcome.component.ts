import {Component, OnInit} from "@angular/core";
import {LoginService} from "../login.service";
import {Router} from "@angular/router";

@Component({
               selector:    "app-welcome",
               templateUrl: "./welcome.component.html",
               styleUrls:   ["./welcome.component.css"]
           })
export class WelcomeComponent implements OnInit
{

    private _loginService: LoginService;
    private _router: Router;


    constructor(loginService: LoginService, router: Router)
    {
        this._loginService = loginService;
        this._router = router;
    }


    public ngOnInit(): void
    {
    }


    public getStarted(): void
    {
        this._loginService.getUser()
        .then((user) => {
            if (!user) {
                return this._loginService.login()
                .then(() => {});
            }
        })
        .then(() => {
            this._router.navigate(["main"]);
        });
    }
}
