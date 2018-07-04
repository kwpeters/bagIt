import {Component, OnInit} from "@angular/core";
import {ModelUserService} from "../model-user.service";
import {Router} from "@angular/router";

@Component({
               selector:    "app-welcome",
               templateUrl: "./welcome.component.html",
               styleUrls:   ["./welcome.component.css"]
           })
export class WelcomeComponent implements OnInit
{

    private _modelUserService: ModelUserService;
    private _router: Router;


    constructor(modelUserService: ModelUserService, router: Router)
    {
        this._modelUserService = modelUserService;
        this._router = router;
    }


    public ngOnInit(): void
    {
    }


    public getStarted(): void
    {
        this._modelUserService.getUser()
        .then((user) => {
            if (!user) {
                return this._modelUserService.login()
                .then(() => {});
            }
        })
        .then(() => {
            this._router.navigate(["main"]);
        });
    }
}
