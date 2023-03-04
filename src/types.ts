export interface TokenPayload {
    id: string,
	apelido: string
}
export interface UsersDB{
    id: string,
    apelido: string,
    email: string,
    password: string,
    created_at: string,
  }

  export interface UsersModels{
    id: string,
    apelido: string,
    email: string,
    password: string,
    createdAt: string,
  }
  
  export interface PostsDB {
    id: string,
    user_id: string
    content: string
    likes: number, 
    dislikes: number,
    created_at: string 
}
export interface PostsModels {
    id: string,
    userId: string
    content: string
    likes: number, 
    dislikes: number,
    createdAt: string 
}

export interface CommentsDB {
    id: string,
    user_id: string,
    post_id: string,
    comment: string, 
    likes: number, 
    dislikes: number,
    created_at: string 
}
export interface CommentsModels {
    id: string,
    userId: string
    postId: string
    comment: string, 
    likes: number,
    dislikes: number,
    createdAt: string 
}

export interface PostsLikesDislikesDB {
    user_id: string
    post_id: string
    like: number, 
}

export interface PostsLikesDislikesModels {
    userId: string
    postId: string
    like: number, 
}
