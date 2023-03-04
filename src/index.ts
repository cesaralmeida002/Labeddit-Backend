import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { usersRouter } from './router/usersRouter'

dotenv.config()

export const app = express()

app.use(cors())
app.use(express.json())

app.listen(Number(process.env.PORT), () => {
    console.log(`Servidor rodando na porta ${Number(process.env.PORT)}`)
})

app.use("/users", usersRouter)