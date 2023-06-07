import Image, { StaticImageData } from "next/image";

export default function ProfileImage({profileImage}:{profileImage:StaticImageData}) {
    return (
        <Image src={profileImage} alt="profile image" style={{width:'100%', height:'100%'}} className="rounded-full" />
    )
}
