import express from "express"
import { UsersBusiness } from "../business/UsersBusiness"
import { HashManager } from "../services/HashManager"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { UsersController } from "../controller/UsersController"
import { UsersDatabase } from "../database/UsersDatabase"

export const usersRouter = express.Router()  

const userController = new UsersController(
    new UsersBusiness(
        new UsersDatabase(),
        new IdGenerator(),
        new TokenManager(),
        new HashManager()
    )
)

usersRouter.post("/signup", userController.signup)
usersRouter.post("/login", userController.login)