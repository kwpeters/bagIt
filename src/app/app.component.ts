import { Component } from '@angular/core';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

    // region Data Members
    private _appName = 'Bagit';
    // endregion

    public constructor() {
        // Initialize Firebase
        const config = {
            apiKey: 'AIzaSyAz94XC84SMI931J1whgZvd-DshZ0KiO8U',
            authDomain: 'bagit-e8c02.firebaseapp.com',
            databaseURL: 'https://bagit-e8c02.firebaseio.com',
            projectId: 'bagit-e8c02',
            storageBucket: 'bagit-e8c02.appspot.com',
            messagingSenderId: '147809261454'
        };
        firebase.initializeApp(config);
    }


    public get appName() {
        return this._appName;
    }
}
