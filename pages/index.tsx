import CreatePost from "@/components/CreatePost"
import "../app/globals.css"
import Layout from "@/components/Layout"
import PostView from "@/components/PostView"
import Post from "@/types/Post"
import User from "@/types/User"
import profile from "../public/images/profile.jpg"
import johnSinger from "../public/images/john-singer.jpg"
const fakeUser: User = {
    name: "Jeff",
    profileImage: profile,
}
const fakePost: Post = {
    author: fakeUser,
    comments: [],
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
                </div>
            </div>
        </Layout>
    )
}