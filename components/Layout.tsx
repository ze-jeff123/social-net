import "../app/globals.css"
import Navbar from "./Navbar"

export default function Layout({children}:React.PropsWithChildren<{}>) {
    return (
        <>
            <Navbar/>
            {
                children
            }
        </>
    )
}