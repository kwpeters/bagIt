import {Component, OnInit} from "@angular/core";
import {Router}            from "@angular/router";
import {Observable}        from "rxjs";
import * as firebase       from "firebase";
import {ModelUserService}  from "../model-user.service";


@Component({
    selector:    "app-main",
    templateUrl: "./main.component.html",
    styleUrls:   ["./main.component.css"]
})
export class MainComponent implements OnInit
{

    private _router: Router;
    private _modelUserService: ModelUserService;


    constructor(router: Router, modelUserService: ModelUserService)
    {
        this._router       = router;
        this._modelUserService = modelUserService;
    }


    public get currentUser$(): Observable<firebase.User | null>
    {
        return this._modelUserService.currentUser$;
    }


    public ngOnInit(): void
    {
    }


    public signOut(): void
    {
        this._modelUserService.logout();
        this._router.navigate([""]);
    }

}
