import Image, { StaticImageData } from "next/image";
import defaultImage from "../public/images/profile.jpg"
import React from "react";

export default function ProfileImage({ profileImage, userUid, isLink = true, style }: { style?: any, profileImage: string | null, userUid: string, isLink?: boolean }) {
    const image = profileImage ?? defaultImage
    const goodStyle = style ?? { width: '100%', height: '100%' }
    const ThisImage = () => {
        return (
            < Image style={goodStyle} src={image} width={160} height={160} alt="profile image" className="rounded-full" />
        )
    }
    return (
        (
            isLink 
            ?
            <a href={"/profile/" + userUid}>
                <ThisImage/>
            </a>
            :
            <ThisImage/>
        )
    )
}
