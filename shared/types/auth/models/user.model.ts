export interface IUser {
    user_id?: number;
    username: string;
    country_code: string;
    phone_number: string;
    password: string;
    
    email: string;
    profilePicUrl?: string;
    preferences?: Record<string, any>;
}

export interface IUserPayload {
    sub: IUser["user_id"],
    username: IUser["username"]   
}