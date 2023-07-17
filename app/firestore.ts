import Post from "@/types/Post";
import { db, storage } from "./init_firebase";
import { collection, doc, getDoc, getDocs, limit, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
import { UploadResult, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import User from "@/types/User";
import PostComment from "@/types/PostComment";

function addPost(post:Post) {
    return setDoc(doc(db,"posts",post.uid), post)
}
function addUser(user:User) {
    return setDoc(doc(db,"users",user.uid), user)
}
function getAllPosts() : Promise<Post[]> {
    const postsRef = collection(db,"posts")
    const q = query(postsRef, orderBy("timestamp","desc"), limit(15))
    
    const posts = getDocs(q).then((snapshot) => {
        return snapshot.docs.map((doc) => doc.data())
    })
    return posts as Promise<Post[]>
}
function getAllPostsOfUser(userUid : string) {
    const postsRef = collection(db,"posts")
    const q = query(postsRef, where("author.uid","==",userUid), orderBy("timestamp","desc"), limit(50))
    
    const posts = getDocs(q).then((snapshot) => {
        return snapshot.docs.map((doc) => doc.data())
    })
    return posts as Promise<Post[]>
}
async function getUser(userUid:string) : Promise<User> {
    const userRef = doc(db, "users",  userUid)
    const userSnap = await getDoc(userRef)
    return userSnap.data() as User
}
function updatePostLikes(post:Post, newUsersWhoLikedUid:string[]):Promise<void> {
    const postRef = doc(db, "posts", post.uid)
    return updateDoc(postRef,{usersWhoLikedUid : newUsersWhoLikedUid})
}
function addComment(post:Post, comment:PostComment) {
    const postRef = doc(db, "posts", post.uid)
    return updateDoc(postRef, "comments", post.comments.concat(comment))
}
function uploadImage(image: File, uid:string) : Promise<UploadResult> {
    const storageRef = ref(storage, 'images/'+uid)
    return uploadBytes(storageRef, image)
}
function downloadImage(name:string) : Promise<string> {
    const imageReference = ref(storage, 'images/'+name)
    return getDownloadURL(imageReference)
}
export {
    addPost,
    getAllPosts,
    uploadImage,
    downloadImage,
    updatePostLikes,
    addComment,
    addUser,
    getUser,
    getAllPostsOfUser,
}