import { StaticImageData } from "next/image";

export default interface User {
    uid:string,
    name:string,
    profileImage : StaticImageData,
}