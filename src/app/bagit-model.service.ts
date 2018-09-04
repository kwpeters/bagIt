import {Injectable}  from "@angular/core";
import * as firebase from "firebase";


@Injectable({providedIn: "root"})
export class BagitModelService
{

    // region Data Members
    private _refRoot: firebase.database.Reference;
    // endregion


    constructor()
    {
        this._refRoot = firebase.database().ref();
    }


    /**
     * Updates or inserts the specified user information into the database
     * @param user - The Firebase user containing information about the user
     * @return A Promise that is resolved once the operation completes
     */
    public upsertUser(user: firebase.User): Promise<void>
    {
        return this._refRoot.child("users").child(user.uid).update({
            displayName: user.displayName,
            photoUrl:    user.photoURL
        })
        // TODO: Get rid of the following prototype code.
        .then(() => {
            this.createDatabase(user, "db1", "one");
        });
    }


    /**
     * Creates a new database that can be access by the specified user.  The
     * user should already be created.
     * @param user - The user that is creating this database.  It is assumed
     * that this user has already been created (see upsertUser()).
     * @param dbName - The name of the new database
     * @param description - A description of the new database
     * @return A Promise that is resolved once the operation completes
     */
    public createDatabase(user: firebase.User, dbName: string, description: string): PromiseLike<void>
    {
        // Push an entry into the user's list of dbs.
        return this._refRoot.child("users").child(user.uid).child("dbs").push(1)
        .then((refDbs: firebase.database.Reference) => {

            const dbid = refDbs.key;
            if (typeof dbid !== "string") {
                throw new Error("Could not create new db entry for user.");
            }

            // Create the main database entry.
            return this._refRoot
            .child("dbs")
            .child(dbid)
            .set({name: dbName, description: description});
        })
        .then(() => {
        });
    }

}
