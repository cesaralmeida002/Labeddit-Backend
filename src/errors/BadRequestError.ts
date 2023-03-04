import { BaseError } from "./BaseError";

export class BadRequestError extends BaseError {
    constructor(
        message: string = "Recurso não encontrado" // mensagem de erro padrão caso não seja enviado um argumento
    ) {
        super(404, message)
    }
}