import { StaticImageData } from "next/image";

export default interface User {
    uid:string,
    displayName:string,
    profileImage : string|null,
    friends:string[],
}