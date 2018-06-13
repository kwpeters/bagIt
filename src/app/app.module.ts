import {BrowserModule}           from "@angular/platform-browser";
import {NgModule}                from "@angular/core";
import {AppRoutingModule}        from "./app-routing.module";
import {AppComponent}            from "./app.component";
import {WelcomeComponent}        from "./welcome/welcome.component";
import {MainComponent}           from "./main/main.component";
import {NotFoundComponent}       from "./not-found/not-found.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule
}                                from "@angular/material";


@NgModule(
    {
        declarations: [
            AppComponent,
            WelcomeComponent,
            MainComponent,
            NotFoundComponent
        ],
        imports:      [
            BrowserModule,
            BrowserAnimationsModule,
            AppRoutingModule,
            MatButtonModule,
            MatCheckboxModule,
            MatIconModule,
            MatMenuModule,
            MatToolbarModule
        ],
        providers:    [],
        bootstrap:    [AppComponent]
    }
)
export class AppModule
{
}
