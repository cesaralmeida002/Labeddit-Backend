import { PostsDB, PostsModels } from "../types";

export class Posts {
    constructor(
        private id: string,
        private userId: string,
        private content: string,
        private likes: number,
        private dislikes: number,
        private createdAt: string,
    ) { }

    public getId(): string {
        return this.id;
    }
    public setId(value: string): void {
        this.id = value;
    }
    public getUserId(): string {
        return this.userId;
    }
    public setUserId(value: string): void {
        this.userId = value;
    }
    public getContent(): string {
        return this.content;
    }
    public setContent(value: string): void {
        this.content = value;
    }
    public getLikes(): number {
        return this.likes;
    }
    public setLikes(value: number): void {
        this.likes = value;
    }
    public getDislikes(): number {
        return this.dislikes;
    }
    public setDislikes(value: number): void {
        this.dislikes = value;
    }
    public upLikes(): void {
        this.likes += 1;
      }
      public downLikes(): void {
        this.likes -= 1;
      }
      public removeDislikes(): void {
        this.likes += 1;
      }
      public downDislikes(): void {
        this.likes -= 1;
      }
    public getCreatedAt(): string {
        return this.createdAt;
    }
    public setCreatedAt(value: string): void {
        this.createdAt = value;
    }

    public toPostModelsDB(): PostsDB {
        return {
            id: this.id,
            user_id: this.userId,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            created_at: this.createdAt,
        }
    }

    public toBusinessPostModels(): PostsModels {
        return {
            id: this.id,
            userId: this.userId,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            createdAt: this.createdAt,
        }
    }
}