import { Posts } from "../modules/Posts";
import { CommentsDB, PostsCreatorDB, PostsDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";
import { UsersDatabase } from "./UsersDatabase";

export class PostsDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts"
    public static TABLE_USERS = "users"
    public static TABLE_COMMENTS = "comment"

    public getAllPosts = async () => {
        const result = await BaseDatabase
        .connection(PostsDatabase.TABLE_POSTS)
        .select()

        return result
    }

    public getPostCreator = async () => {
        const postDB = await this.getAllPosts()
        const userDB = await BaseDatabase
        .connection(UsersDatabase.TABLE_USERS)
        .select()

        return{
            postDB,
            userDB,
        }
    }
    public insertPost = async (postDB: PostsDB) => {
        const result = await BaseDatabase.connection(PostsDatabase.TABLE_POSTS).insert(postDB)
    }

    public getPostById = async (id: string): Promise<PostsDB | undefined> => {
        const [result]: PostsDB[] | undefined = await BaseDatabase.connection(PostsDatabase.TABLE_POSTS).select().where({id: id})
    return result
    }
    public createComment = async(newCommentDB: CommentsDB) => {
        await BaseDatabase.connection(PostsDatabase.TABLE_COMMENTS).insert(newCommentDB)
    }
    public updatePost = async(newUpDatePostDB: PostsDB, id: string) => {
        await BaseDatabase.connection(PostsDatabase.TABLE_POSTS).update(newUpDatePostDB).where({id: id})
    }
}