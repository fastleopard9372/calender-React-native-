export interface SignUpDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface SignInDTO {
    email: string;
    password: string;
}

export interface UserDTO {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}
