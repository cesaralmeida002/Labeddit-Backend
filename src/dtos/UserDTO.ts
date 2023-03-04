export interface SignupInput {
    apelido: unknown,
    email: unknown,
    password: unknown
}

export interface SignupOutput {
    token: string
}

export interface LoginInput {
    email: unknown,
    senha: unknown 
}

export interface LoginOutput {
    email: unknown,
    senha: unknown 
}

export interface LogoutOutput {
    token: string
}