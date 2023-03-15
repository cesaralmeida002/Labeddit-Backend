import { Request, Response } from "express";
import { PostsBusiness } from "../business/PostsBusiness";
import { createCommentInput, CreatePostInput, GetPostInput, LikeOrDislikeInput } from "../dtos/PostsDTO";
import { BaseError } from "../errors/BaseError";

export class PostsController {
    constructor(
        private PostsBusiness: PostsBusiness
    ) { }

    public getPosts = async (req: Request, res: Response) => {
        try {
            const input: GetPostInput = {
                token: req.headers.authorization
            }

            const output = await this.PostsBusiness.getPosts(input)

            res.status(200).send(output)
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro Inesperado")
            }
        }
    }

    public createPost = async (req: Request, res: Response) => {
        try {
            const input: CreatePostInput = {
                token: req.body.authorization,
                content: req.body.content,
            }
            console.log("Input da Controller", input)
            const output = await this.PostsBusiness.createPost(input)
            res.status(201).send("Post criado com sucesso")

        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro Inesperado")
            }
        }
    }
    public createComment = async (req: Request, res: Response) => {
        try {
            const input: createCommentInput = {
                id_post: req.body.id_post,
                comment: req.body.comment,
                token: req.body.authorization as string,
            }

            const output = await this.PostsBusiness.createComment(input)
            res.status(201).send(output)
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro Inesperado")
            }
        }
    }
    public likeOrDislike = async (req: Request, res: Response) => {
        try {
            const input: LikeOrDislikeInput = {
                idToLikeOrDislike: req.params.id,
                token: req.headers.authorization,
                like: req.body.like
            }
            await this.PostsBusiness.likeOrDislike(input)
            res.status(200).end()
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro Inesperado")
            }
        }
    }
}