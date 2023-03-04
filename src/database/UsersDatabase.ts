import { UsersDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class UsersDatabase extends BaseDatabase {
    public static TABLE_USERS = "users"

    public async insert(userDB: UsersDB):Promise<void>{
        await BaseDatabase.connection(UsersDatabase.TABLE_USERS).insert(userDB)
    }
}