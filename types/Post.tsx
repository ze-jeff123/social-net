import { StaticImageData } from "next/image";
import User from "./User";
import PostComment from "./PostComment";

export default interface Post {
    uid:string,
    author : User,
    text : string,
    image : string | null,
    usersWhoLikedUid : string[],
    comments : PostComment[]
    timestamp : string,
}