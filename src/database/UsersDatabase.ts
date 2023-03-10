import { PostsDB, UsersDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";
import { PostsDatabase } from "./PostsDatabase";

export class UsersDatabase extends BaseDatabase {
    public static TABLE_USERS = "users"

    public async insert(userDB: UsersDB):Promise<void>{
        await BaseDatabase.connection(UsersDatabase.TABLE_USERS).insert(userDB)
    }

    public findByEmail = async(email: string): Promise<UsersDB | undefined> => {
        const result: UsersDB[] = await BaseDatabase.connection(UsersDatabase.TABLE_USERS).select().where({email})
        
        return result[0]
    }
    public getPostById = async (id: string): Promise<PostsDB | undefined> => {
        const [result]: PostsDB[] | undefined = await BaseDatabase.connection(PostsDatabase.TABLE_POSTS).select().where({id: id})
    return result
    }
}