import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import {WelcomeComponent} from "./welcome/welcome.component";
import {MainComponent} from "./main/main.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {LoginGuard} from "./login.guard";

const routes: Routes = [
    {path: "",        redirectTo: "welcome", pathMatch: "full"},
    {path: "welcome", component: WelcomeComponent},
    {path: "main",    component: MainComponent, canActivate: [LoginGuard]},
    {path: "**",      component: NotFoundComponent}, // 404 component
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
