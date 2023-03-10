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
    password: unknown 
}

export interface LoginOutput {
    token: string
    
}

export interface LogoutOutput {
    token: string
}