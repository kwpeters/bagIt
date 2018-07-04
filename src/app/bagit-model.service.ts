import {Injectable}  from "@angular/core";
import * as firebase from "firebase";
import * as uuid from "uuid";


@Injectable({providedIn: "root"})
export class BagitModelService
{

    // TODO: Get rid of this in favor of just getting a database-generated key.
    // https://firebase.google.com/docs/database/web/read-and-write
    private static _generateUid(): string
    {
        return `${Date.now()}-${uuid.v4()}`;
    }


    // region Data Members
    private _refRoot: firebase.database.Reference;
    // endregion


    constructor()
    {
        this._refRoot = firebase.database().ref();
    }


    public upsertUser(user: firebase.User): Promise<void>
    {
        return this._refRoot.child("users").child(user.uid).update({
            displayName: user.displayName,
            photoUrl:    user.photoURL
        })
        .then(() => {
            this.createDatabase(user, "db1", "one");
        });
    }


    public createDatabase(user: firebase.User, dbName: string, description: string): Promise<void>
    {
        // TODO: Do a single update() here as explained in this doc.
        // https://firebase.google.com/docs/database/web/read-and-write

        const dbid = BagitModelService._generateUid();

        return this._refRoot.child("users").child(user.uid).child("dbs").child(dbid).set(1)
        .then(() => {
            return this._refRoot.child("dbs")
            .child(dbid)
            .set({name: dbName, description: description});
        })
        .then(() => {});
    }

}
