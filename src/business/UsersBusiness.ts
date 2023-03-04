import { UsersDatabase } from "../database/UsersDatabase";
import { SignupInput, SignupOutput } from "../dtos/UserDTO";
import { BadRequestError } from "../errors/BadRequestError";
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
            throw new BadRequestError("Deve ser uma 'string'")
        }
        if (typeof email !== "string") {
            throw new BadRequestError("Deve ser uma 'string'")
        }
        if (typeof password !== "string") {
            throw new BadRequestError("Deve ser uma 'string'")
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
}