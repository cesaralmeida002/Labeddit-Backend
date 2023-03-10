import { PostsModels } from "../types";

export interface GetPostInput {
    token: string | undefined
}

export type GetPostOutput = PostsModels []

export interface CreatePostInput {
    token: string,
    content: unknown
}

export interface LikeOrDislikeInput {
    idToLikeOrDislike: string,
    token: string,
    like: unknown
}
export interface createCommentInput{
    id_post: string,
    comment: string,
    token: string,
}