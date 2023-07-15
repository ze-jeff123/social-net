import User from "@/types/User"
import "../app/globals.css"
import Navbar from "./Navbar"

export default function Layout({ children, currentUser }: React.PropsWithChildren<{currentUser : User | null}>) {
    return (
            <div>
                <div className='relative z-50'>
                    <Navbar currentUser={currentUser}/>
                </div>
                <div className='pt-6'>
                    {
                        children
                    }
                </div>
            </div>

    )
}