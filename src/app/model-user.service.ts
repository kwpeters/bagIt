import {Injectable}                                from "@angular/core";
import {BehaviorSubject, Observable}               from "rxjs/index";
import {auth, database, User}                      from "firebase/app";
import * as _                                      from "lodash";
import {BagitModelService}                         from "./bagit-model.service";


// import {BagitModelService} from "./bagit-model.service";


@Injectable({
    providedIn: "root"
})
export class ModelUserService
{

    // region Data Members
    private _currentUser$: BehaviorSubject<User | null>;
    private _firebaseAuth: auth.Auth;
    private _curFirebaseUser: User | null | undefined;
    private _authInitializedPromise: Promise<void>;
    private _resolveAuthInitializedPromise!: () => void;
    private _model: BagitModelService;

    private _isConnected$: BehaviorSubject<boolean>;

    // endregion

    constructor(model: BagitModelService)
    {
        this._curFirebaseUser = undefined;
        this._currentUser$    = new BehaviorSubject<User | null>(null);
        this._model = model;

        //
        // Setup to handle authentication state changes.
        //
        this._authInitializedPromise = new Promise((resolve) => {
            // Hang on to the resolve function so that we can call it once the
            // initial auth state change happens.
            this._resolveAuthInitializedPromise = resolve;

        });
        this._firebaseAuth = auth();
        this._firebaseAuth.onAuthStateChanged(this.onAuthStateChanged.bind(this));

        this._isConnected$ = new BehaviorSubject<boolean>(false);
        const connectedRef = database().ref(".info/connected");
        connectedRef.on("value", (snap: database.DataSnapshot | null) => {
            if (snap) {
                this._isConnected$.next(snap.val());
            }
        });
    }


    public get currentUser$(): Observable<User | null>
    {
        return this._currentUser$.asObservable();
    }


    public get isConnected$(): Observable<boolean>
    {
        return this._isConnected$.asObservable();
    }


    public login(): Promise<User | void | null>
    {
        const googleAuthProvider = new auth.GoogleAuthProvider();
        return this._firebaseAuth.signInWithPopup(googleAuthProvider)
        .then((userCred: auth.UserCredential) => {
            return userCred.user;
        });
    }


    public logout(): Promise<void>
    {
        return this._firebaseAuth.signOut();
    }


    // TODO: Should all use of this be replaced with currentUser$?
    public getUser(): Promise<User | null>
    {
        // We have to wait for Firebase's first onAuthStateChanged invocation in
        // order to successfully determine the current authorization state.
        return this._authInitializedPromise
        .then(() => {
            if (this._curFirebaseUser === undefined)
            {
                throw new Error("Expedted Firebase user to be initialized.");
            }
            return this._curFirebaseUser;
        });
    }


    /**
     * Event hander that is invoked when the auth state changes.
     * @param firebaseUser - The authenticated user
     */
    private onAuthStateChanged(firebaseUser: User): void
    {
        // http://stackoverflow.com/questions/37673616/firebase-android-onauthstatechanged-called-twice
        const oldUserDisplayName = _.get(this._curFirebaseUser, "displayName", "nobody");
        const newUserDisplayName = _.get(firebaseUser, "displayName", "nobody");


        if (this._curFirebaseUser === undefined)
        {
            // Got initial listener registration invocation.
            console.log("Got initial listener registration callback.");
            this.updateCurrentUser(firebaseUser);
            this._resolveAuthInitializedPromise();
            return;
        }

        if (this._curFirebaseUser === null && firebaseUser === null)
        {
            return;
        }

        if (firebaseUser === null)
        {
            console.log("The user has logged off.");
            this.updateCurrentUser(null);
            return;
        }

        // The current user used to be null and now it is not.  A user has
        // logged in!
        if (this._curFirebaseUser === null)
        {
            console.log(`User ${newUserDisplayName} has logged in.`);
            this.updateCurrentUser(firebaseUser);
            return;
        }

        // The same user has logged in.
        if (firebaseUser.uid === this._curFirebaseUser.uid)
        {
            console.log(`The token for ${newUserDisplayName} has been refreshed.`);
            // Don't need to update, but get the latest user info.
            this.updateCurrentUser(firebaseUser);
            return;
        }
        else
        {
            // The valid logged in user has been replaced with another valid
            // user.
            console.log(`User ${oldUserDisplayName} has logged out and user ${newUserDisplayName} has logged in.`);
            this.updateCurrentUser(firebaseUser);
            return;
        }
    }


    /**
     * Helper method that updates this._currentUser$ and also makes sure that
     * user has been created in the model.
     * @param user - The new current user or null if there is no logged in user.
     */
    private updateCurrentUser(user: User | null): void
    {
        this._curFirebaseUser = user;

        // If there is a current user, make sure it exists in the model.
        (user ? this._model.upsertUser(user) : Promise.resolve())
        .then(() => {
            this._currentUser$.next(user);
        });
    }

}
