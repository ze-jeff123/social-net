import Post from "@/types/Post";
import { db, storage } from "./init_firebase";
import { collection, doc, getDocs, limit, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
import { UploadResult, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import User from "@/types/User";

function addPost(post:Post) {
    return setDoc(doc(db,"posts",post.uid), post)
}

function getAllPosts() : Promise<Post[]> {
    const postsRef = collection(db,"posts")
    const q = query(postsRef, orderBy("timestamp","desc"), limit(15))
    
    const posts = getDocs(q).then((snapshot) => {
        return snapshot.docs.map((doc) => doc.data())
    })
    return posts as Promise<Post[]>
}

function updatePostLikes(post:Post, newUsersWhoLikedUid:string[]):Promise<void> {
    const postRef = doc(db, "posts", post.uid)
    return updateDoc(postRef,{usersWhoLikedUid : newUsersWhoLikedUid})
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
    updatePostLikes
}