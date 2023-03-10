import { UsersDatabase } from "../database/UsersDatabase";
import { LoginInput, LoginOutput, SignupInput, SignupOutput } from "../dtos/UserDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFound";
import { Users } from "../modules/Users";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { TokenPayload } from "../types";

export class UsersBusiness {
    constructor(
        private userDatabase: UsersDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ){}
    public signup = async (input: SignupInput): Promise<SignupOutput> => {
        const { apelido, email, password } = input
        if (typeof apelido !== "string") {
            throw new BadRequestError("'APELIDO' Deve ser uma string")
        }
        if (typeof email !== "string") {
            throw new BadRequestError("'EMAIL' Deve ser uma string")
        }
        if (typeof password !== "string") {
            throw new BadRequestError("'PASSWORD' Deve ser uma string")
        }

        const id = this.idGenerator.generate()
        const hashPassword = await this.hashManager.hash(password)

        const newUser = new Users(
            id,
            apelido,
            email,
            hashPassword,
            new Date().toISOString()
        )
        const userDB = newUser.toUserModelDB()
        await this.userDatabase.insert(userDB)

        const payload: TokenPayload = {
            id: newUser.getId(),
            apelido: newUser.getApelido()
        }

        const output: SignupOutput = {
            token: this.tokenManager.createToken(payload)
        }

        return output
    }

    public login = async(input: LoginInput): Promise<LoginOutput> =>{
        const { email, password } = input
        
        if (typeof email !== "string") {
            throw new BadRequestError("'E-MAIL'Deve ser uma string")
        }
        if (typeof password !== "string") {
            throw new BadRequestError("'PASSWORD'Deve ser uma string")
        }
        const userDB = await this.userDatabase.findByEmail(email)

        if(!userDB){
            throw new NotFoundError("'E-mail' inválido")
        }

        const isPasswordCorrect = await this.hashManager.compare(password, userDB.password)

        if(!isPasswordCorrect){
            throw new NotFoundError("'PASSWORD' inválido")
        }

        const users = new Users(
            userDB.id,
            userDB.apelido,
            userDB.email,
            userDB.password,
            userDB.created_at,
        )

        const payload: TokenPayload = {
            id: users.getId(),
            apelido: users.getApelido()
        }

        const token = this.tokenManager.createToken(payload)

        const output: LoginOutput = {
            token
        }
        return output
    }
}