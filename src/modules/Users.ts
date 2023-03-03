import { UsersDB, UsersModels } from "../types"

export class Users{
   
    constructor(
        private id: string,
        private apelido: string,
        private email: string,
        private password: string,
        private createdAt: string,
    ){}
    public getId(): string {
        return this.id;
    }
    public setId(value: string):void {
        this.id = value;
    }
    public getApelido(): string {
        return this.apelido;
    }
    public setApelido(value: string):void {
        this.apelido = value;
    }
    public getEmail(): string {
        return this.email;
    }
    public setEmail(value: string):void {
        this.apelido = value;
    }
    public getPassword(): string {
        return this.password;
    }
    public setPassword(value: string):void {
        this.password = value;
    }
    public getCreatedAt(): string {
        return this.createdAt;
    }
    public setCreatedAt(value: string):void {
        this.createdAt = value;
    }

    public toUserModelDB(): UsersDB{
        return{
            id: this.id,
            apelido: this.apelido,
            email: this.email,
            password: this.password,
            created_at: this.createdAt
        }
    }

    public toUserBusinessDB(): UsersModels{
        return{
            id: this.id,
            apelido: this.apelido,
            email: this.email,
            password: this.password,
            createdAt: this.createdAt
        }
    }
}