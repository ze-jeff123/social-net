import Post from "@/types/Post";
import { db, storage } from "./init_firebase";
import { arrayUnion, collection, doc, getDoc, getDocs, limit, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
import { UploadResult, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import User from "@/types/User";
import PostComment from "@/types/PostComment";

function addPost(post:Post) {
    const postDb:any = {...post}
    postDb.author = post.author.uid
    return setDoc(doc(db,"posts",post.uid), postDb)
}
function addComment(postUid:string, comment:PostComment) {
    const commentDb:any = {...comment}
    commentDb.author = comment.author.uid
    const postRef = doc(db, "posts", postUid)
    return updateDoc(postRef, {
        comments : arrayUnion(commentDb)
    })
}
function addUser(user:User) {
    return setDoc(doc(db,"users",user.uid), user)
}
function updateUser(userUid:string, newUser:User) {
    setDoc(doc(db,"users",userUid), newUser)
}
function addFriend(user1:User, user2:User) {
    if (user1.friends.includes(user2.uid)) return Promise.resolve<void>
    const userRef = doc(db,"users",user1.uid)
    return updateDoc(userRef,{friends : user1.friends.concat(user2.uid)})
}
function removeFriend(user1:User, user2:User) {
    if (!user1.friends.includes(user2.uid)) return Promise.resolve<void>
    const userRef = doc(db,"users",user1.uid)
    return updateDoc(userRef, {friends: user1.friends.filter((friend)=>friend != user2.uid)})
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
    const q = query(postsRef, where("author","==",userUid), orderBy("timestamp","desc"), limit(50))
    
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
    addFriend,
    removeFriend,
    updateUser,
}