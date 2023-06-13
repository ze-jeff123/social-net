import Post from "@/types/Post";
import { db } from "./init_firebase";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";


function addPost(post:Post) {
    return setDoc(doc(db,"posts",post.uid), post)
}

function getAllPosts() : Promise<Post[]> {
    const posts = getDocs(collection(db,"posts")).then((snapshot) => {
        return snapshot.docs.map((doc) => doc.data())
    })
    return posts as Promise<Post[]>
}
export {
    addPost,
    getAllPosts
}