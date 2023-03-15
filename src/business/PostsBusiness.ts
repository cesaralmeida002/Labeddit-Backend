
import { runInThisContext } from "vm";
import { PostsDatabase } from "../database/PostsDatabase";
import { createCommentInput, CreatePostInput, GetPostInput, GetPostOutput, LikeOrDislikeInput } from "../dtos/PostsDTO";
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
                creator(postDB.user_id),
                postDB.post_comment
            )

            return post.toBusinessPostModels()
        })

        return posts
    }

    public createPost = async (input: CreatePostInput): Promise<void> => {
        const { token, content } = input
        if (token === undefined) {
            throw new BadRequestError("'TOKEN' deve ser string")
        }
        if (content === null) {
            throw new BadRequestError("'CONTENT' inválido")
        }
        if (typeof content !== "string") {
            throw new BadRequestError("'CONTENT' deve ser uma string")
        }
        const payload = this.tokenManager.getPayload(token)
        if (payload === null) {
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
            {
                id: user_id,
                name: payload.apelido
            },
            {
                id: '',
                post_id: '',
                comment: '',
                likes: 0,
                dislikes: 0,
                created_at: '',
                user: {
                    user_id: '',
                    name: '',
                }
            }
        )
        const postsDB = newPost.toPostModelsDB()

        await this.postsDatabase.insertPost(postsDB)
    }
    public createComment = async (input: createCommentInput): Promise<void> => {
        const { id_post, comment, token } = input
        if (id_post !== "string") {
            throw new BadRequestError("'ID_POST' deve ser string")
        }
        if (comment === null) {
            throw new BadRequestError("'COMMENT' inválido")
        }
        if (typeof comment !== "string") {
            throw new BadRequestError("'COMMENT' deve ser uma string")
        }
        if (typeof id_post !== "string") {
            throw new BadRequestError("'ID_POST' deve ser uma string")
        }
        const payload = this.tokenManager.getPayload(token)
        if (payload === null) {
            throw new BadRequestError("'TOKEN' inválido")
        }
        const postById = await this.postsDatabase.getPostById(id_post)
        if (!postById) {
            throw new BadRequestError("'POST' não encontrado")
        }

        const id = this.idGenerator.generate()
        const content = ""
        const likes = 0
        const dislikes = 0
        const created_at = new Date().toISOString()
        const user_id = payload.id

        const newComment = new Posts(
            id,
            content,
            comment,
            likes,
            dislikes,
            created_at,
            {
                id: user_id,
                name: payload.apelido
            },
            {
                id: "",
                post_id: "",
                comment: "",
                likes: 0,
                dislikes: 0,
                created_at: "",
                user: {
                    user_id: "",
                    name: "",
                }
            }

        )
        const updatePost = new Posts(
            postById.id,
            postById.content,
            postById.comment,
            postById.likes,
            postById.dislikes,
            postById.created_at,
            {
                id: user_id,
                name: payload.apelido
            },
            {
                id: '',
                post_id: '',
                comment: '',
                likes: 0,
                dislikes: 0,
                created_at: '',
                user: {
                    user_id: '',
                    name: ''
                }
            }
        )
        const newCommentDB = newComment.toModelsCommentDB()
        await this.postsDatabase.createComment(newCommentDB)

        const newUpDatePostDB = updatePost.toPostModelsDB()
        await this.postsDatabase.updatePost(newUpDatePostDB, postById.id)
    }
    public likeOrDislike = async(input: LikeOrDislikeInput): Promise<void> => {
        const { idToLikeOrDislike, token, like} = input
        if (token === undefined) {
            throw new BadRequestError("'TOKEN' inválido")
        }
   
        const payload = this.tokenManager.getPayload(token)
   
        if (payload === null) {
            throw new BadRequestError("'TOKEN' inválido")
        }
   
        if (typeof like !== "boolean") {
            throw new BadRequestError("'LIKE' deve ser um boolean")
        }
    
        const postToLike = await this.postsDatabase.getPostById(idToLikeOrDislike)
        const commentToLike = await this.postsDatabase.getCommentById(idToLikeOrDislike)

        if(!postToLike){
            throw new BadRequestError("'ID' não encontrado")
        }

        if(!commentToLike){
            throw new BadRequestError("'ID' não encontrado")
        }
        if(postToLike){
            let like = postToLike.likes
            let dislike = postToLike.dislikes

            if(like === 0){
                dislike++
            }else if(like === 1){
                like++
            }else{
                throw new BadRequestError("Você não pode realizar duas ações no mesmo post")
            }
            
        }
        const postLike = new Posts (
            idToLikeOrDislike, 
            postToLike.content,
            postToLike.comment,
            postToLike.likes,
            postToLike.dislikes,
            postToLike.created_at,
            {id: postToLike.user_id,
            name:payload.apelido},
            {id: '',
            post_id: '',
            comment: '',
            likes: 0,
            dislikes: 0,
            created_at: '',
                user: {
                    user_id: '',
                    name: ''
            }
            }
        )

        const userId = payload.id
        const likesSended = like ? 1 : 0 

        const updateLikePost = {
            user_id: userId,
            post_id: idToLikeOrDislike,
            like: likesSended,
        }

        const postLikeDB = postLike.toPostModelsDB()
        await this.postsDatabase.updatePost(postLikeDB, idToLikeOrDislike)
        await this.postsDatabase.updateLikeOrDislikePost(updateLikePost)

        if(commentToLike){
            let like = commentToLike.likes
            let dislike = commentToLike.dislikes

            if(like === 0){
                dislike++
            }else if(like === 1){
                like++
            }else{
                throw new BadRequestError("Você não pode realizar duas ações no mesmo post")
            }
            
        }

        const commentLike = new Posts (
            idToLikeOrDislike, 
            commentToLike.content,
            commentToLike.comment,
            commentToLike.likes,
            commentToLike.dislikes,
            commentToLike.created_at,
            {id: commentToLike.user_id,
            name:payload.apelido},
            {id: '',
            post_id: '',
            comment: '',
            likes: 0,
            dislikes: 0,
            created_at: '',
                user: {
                    user_id: '',
                    name: ''
            }
            }
        )
        const updateLikeComment = {
            user_id: userId,
            comment_id: idToLikeOrDislike,
            like: likesSended,
        }
        const commentLikeDB = commentLike.toPostModelsDB()
        await this.postsDatabase.updateComment(commentLikeDB, idToLikeOrDislike)
        await this.postsDatabase.updateLikeOrDislikeComment(updateLikeComment)
    }

}
