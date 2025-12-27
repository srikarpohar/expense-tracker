import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_API = "isPublicApi";
export const PublicAPIResource = () => SetMetadata(IS_PUBLIC_API, true);