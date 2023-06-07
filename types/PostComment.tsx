import User from "./User";

export default interface PostComment {
    uid:string,
    author : User,
    text : string,
}
