
import { PostsDatabase } from "../database/PostsDatabase";
import { createCommentInput, CreatePostInput, GetPostInput, GetPostOutput } from "../dtos/PostsDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFound";
import { Posts } from "../modules/Posts";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";


export class PostsBusiness {
    constructor(
        private postsDatabase: PostsDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
    ) { }

    public getPosts = async (input: GetPostInput) => {

        const { token } = input

        if (!token) {
            throw new NotFoundError("'TOKEN' ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("'TOKEN' inválido")
        }

        const { postDB, userDB } = await this.postsDatabase.getPostCreator()

        function creator(userId: string) {
            const user = userDB.find((userDB) => {
                return userDB.id === userId
            })

            return {
                id: user.id,
                name: user.name
            }
        }

        const posts = postDB.map((postDB) => {
            const post = new Posts(
                postDB.id,
                postDB.content,
                postDB.comment,
                postDB.likes,
                postDB.dislikes,
                postDB.created_at,
                creator(postDB.user_id)
            )

            return post.toBusinessPostModels()
        })

        return posts
    }

    public createPost = async (input: CreatePostInput): Promise<void> => {
        const {token, content} = input
        if (token === undefined){
            throw new BadRequestError ("'TOKEN' deve ser string")
        }
        if(content === null){
            throw new BadRequestError("'CONTENT' inválido")
        }
        if( typeof content !== "string"){
            throw new BadRequestError("'CONTENT' deve ser uma string")
        }
        const payload = this.tokenManager.getPayload(token)
        if(payload === null){
            throw new BadRequestError("'TOKEN' inválido")
        }

        const id = this.idGenerator.generate()
        const created_at = new Date().toISOString()
        const user_id = payload.id

        const newPost = new Posts(
            id,
            content,
            "",
            0,
            0,
            created_at,
            {id: user_id,
            name: payload.apelido}
        )
        const postsDB = newPost.toPostModelsDB()

        await this.postsDatabase.insertPost(postsDB)
    }
    public createComment = async (input: createCommentInput): Promise <void> => {
        const {id_post, comment,token } = input
        if (id_post !== "string"){
            throw new BadRequestError ("'ID_POST' deve ser string")
        }
        if(comment === null){
            throw new BadRequestError("'COMMENT' inválido")
        }
        if( typeof comment !== "string"){
            throw new BadRequestError("'COMMENT' deve ser uma string")
        }
        if( typeof id_post !== "string"){
            throw new BadRequestError("'ID_POST' deve ser uma string")
        }
        const payload = this.tokenManager.getPayload(token)
        if(payload === null){
            throw new BadRequestError("'TOKEN' inválido")
        }
        const filterPostById = await this.postsDatabase.getPostById(id_post)
        if (!filterPostById) {
            throw new BadRequestError("'POST' não encontrado")
        }
    }
}