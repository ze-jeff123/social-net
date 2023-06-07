import CreatePost from "@/components/CreatePost"
import "../app/globals.css"
import Layout from "@/components/Layout"
import PostView from "@/components/PostView"
import Post from "@/types/Post"
import User from "@/types/User"
import profile from "../public/images/profile.jpg"
import johnSinger from "../public/images/john-singer.jpg"
import PostComment from "@/types/PostComment"
const fakeUser: User = {
    uid:"123",
    name: "Jeff",
    profileImage: profile,
}
const fakeComment : PostComment = {
    uid:"1241",
    author : fakeUser,
    text : "That is a really nice photo, thanks for sharing Jeff!",
}
const fakeComment2 : PostComment = {
    uid:"1241",
    author : fakeUser,
    text : "I know, right? He really did a nice job",
}
const fakePost: Post = {
    uid:"1312",
    author: fakeUser,
    comments: [fakeComment, fakeComment2],
    image: johnSinger,
    likes: 3,
    text: "Hi everyone! Just wanted to share this cool painint, enjoy!",
}
export default function Home() {
    return (
        <Layout>
            <div className='flex justify-center pt-6'>
                <div className='flex-1 flex flex-col max-w-2xl gap-5'>
                    <CreatePost />
                    <PostView post={fakePost} />
                    <PostView post={fakePost} />
                </div>
            </div>
        </Layout>
    )
}