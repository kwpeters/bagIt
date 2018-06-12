import {Injectable} from "@angular/core";
import * as firebase from "firebase";
import {BehaviorSubject, Observable} from "rxjs";
import * as _ from "lodash";

@Injectable({
                providedIn: "root"
            })
export class LoginService
{
    private _currentUser$: BehaviorSubject<firebase.User | null>;

    private _firebaseAuth: firebase.auth.Auth;
    private _curFirebaseUser: firebase.User | null | undefined;
    private _authInitializedPromise: Promise<void>;
    private _resolveAuthInitializedPromise!: () => void;


    constructor()
    {
        // Initialize Firebase
        const config = {
            apiKey: "AIzaSyAz94XC84SMI931J1whgZvd-DshZ0KiO8U",
            authDomain: "bagit-e8c02.firebaseapp.com",
            databaseURL: "https://bagit-e8c02.firebaseio.com",
            projectId: "bagit-e8c02",
            storageBucket: "bagit-e8c02.appspot.com",
            messagingSenderId: "147809261454"
        };
        firebase.initializeApp(config);

        this._curFirebaseUser = undefined;
        this._currentUser$ = new BehaviorSubject<firebase.User | null>(null);

        //
        // Setup to handle authentication state changes.
        //
        this._authInitializedPromise = new Promise((resolve) => {
            // Hang on to the resolve function so that we can call it once the
            // initial auth state change happens.
            this._resolveAuthInitializedPromise = resolve;

        });
        this._firebaseAuth = firebase.auth();
        this._firebaseAuth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
    }


    public get currentUser$(): Observable<firebase.User | null>
    {
        return this._currentUser$.asObservable();
    }


    public login(): Promise<firebase.auth.UserCredential> {
        const googleAuthProvider: firebase.auth.GoogleAuthProvider  =  new firebase.auth.GoogleAuthProvider();
        return this._firebaseAuth.signInWithPopup(googleAuthProvider)
        // .then((result) => {
        //     console.log('\n\n----- result -----');
        //     console.log(JSON.stringify(result, undefined, 4) + '\n\n');
        // })
        .catch((err) => {
            console.log("\n\n----- Error logging in -----");
            console.log(JSON.stringify(err, undefined, 4) + "\n\n");
        });
    }


    public logout(): void {
        this._firebaseAuth.signOut();
    }


    public getUser(): Promise<firebase.User | null> {

        // We have to wait for Firebase's first onAuthStateChanged invocation in
        // order to successfully determine the current authorization state.
        return this._authInitializedPromise
        .then(() => {
            if (this._curFirebaseUser === undefined) {
                throw new Error("Expedted Firebase user to be initialized.");
            }
            return this._curFirebaseUser;
        });
    }


    private onAuthStateChanged(firebaseUser: firebase.User): void {

        // http://stackoverflow.com/questions/37673616/firebase-android-onauthstatechanged-called-twice

        if (this._curFirebaseUser === undefined) {
            // Got initial listener registration invocation.
            console.log("Got initial listener registration callback.", _.get(firebaseUser, "displayName", "null"));
            this._curFirebaseUser = firebaseUser;
            this._currentUser$.next(this._curFirebaseUser);
            this._resolveAuthInitializedPromise();
            return;
        }

        if (this._curFirebaseUser === null && firebaseUser === null) {
            return;
        }

        if (firebaseUser === null) {
            console.log("The user has logged off.");
            this._curFirebaseUser = null;
            this._currentUser$.next(this._curFirebaseUser);
            return;
        }

        // The current user used to be null and now it is not.  A user has logged in!
        if (this._curFirebaseUser === null) {
            console.log(`User ${firebaseUser.uid} has logged in.`, firebaseUser);
            this._curFirebaseUser = firebaseUser;
            this._currentUser$.next(this._curFirebaseUser);
            return;
        }

        // The same user has logged in.
        if (firebaseUser.uid === this._curFirebaseUser.uid) {
            console.log("The current user's token has been refreshed.");
            this._curFirebaseUser = firebaseUser;  // Don't need to update, but get the latest user info.
            this._currentUser$.next(this._curFirebaseUser);
            return;
        } else {
            // The valid logged in user has been replaced with another valid user.
            console.log(`User ${firebaseUser.uid} has logged in.`);
            this._curFirebaseUser = firebaseUser;
            this._currentUser$.next(this._curFirebaseUser);
            return;
        }
    }

}
