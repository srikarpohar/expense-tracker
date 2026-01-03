import { IAttachment } from "../../common/models";

export interface IUser {
    user_id?: number;
    username: string;
    country_code: string;
    phone_number: string;
    password: string;
    
    email: string;
    profile_pic_id?: number | IAttachment;
    preferences?: Record<string, any>;
}

export interface IUserPayload {
    sub: number,
    username: IUser["username"]   
}