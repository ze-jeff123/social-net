import "../app/globals.css"
import Navbar from "./Navbar"

export default function Layout({ children }: React.PropsWithChildren<{}>) {
    return (
            <div>
                <div className='relative z-50'>
                    <Navbar />
                </div>
                <div className='pt-6'>
                    {
                        children
                    }
                </div>
            </div>

    )
}