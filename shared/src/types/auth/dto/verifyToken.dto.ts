import { IUserPayload } from "../models/user.model"; 

export interface VerifyTokenResponseDTO {
    payload: IUserPayload
}