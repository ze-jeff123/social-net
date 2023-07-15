import Post from "@/types/Post";
import { db, storage } from "./init_firebase";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { UploadResult, getDownloadURL, ref, uploadBytes } from "firebase/storage";

function addPost(post:Post) {
    return setDoc(doc(db,"posts",post.uid), post)
}

function getAllPosts() : Promise<Post[]> {
    const posts = getDocs(collection(db,"posts")).then((snapshot) => {
        return snapshot.docs.map((doc) => doc.data())
    })
    return posts as Promise<Post[]>
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
}