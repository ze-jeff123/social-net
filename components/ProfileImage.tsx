import Image, { StaticImageData } from "next/image";
import defaultImage from "../public/images/profile.jpg"

export default function ProfileImage({ profileImage }: { profileImage: string | null }) {
    const image = profileImage ?? defaultImage
    
    return (
        < Image src={image} width={160} height={160} alt="profile image" style={{ width: '100%', height: '100%' }} className="rounded-full" />
    )
}
