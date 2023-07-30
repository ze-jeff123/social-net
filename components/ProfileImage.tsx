import Image, { StaticImageData } from "next/image";
import defaultImage from "../public/images/guest-profile.png"
import React from "react";
import Link from "next/link";

export default function ProfileImage({ profileImage, userUid, isLink = true, style, size = 47 }: {size? : "100%" | number,  style?: any, profileImage: string | null, userUid: string, isLink?: boolean }) {
    const image = profileImage ?? defaultImage
    const goodStyle = style ?? (
        size==="100%" ? 
        { width: '100%', height: '100%' } :
        { width : `${size}px`, height : `${size}px`}
    )
    const ThisImage = () => {
        return (
            < Image style={Object.assign({}, goodStyle, {objectFit:"cover"})} src={image} width={160} height={160} alt="profile image" className="rounded-full" />
        )
    }
    return (
        (
            isLink 
            ?
            <Link  style={goodStyle} className="block" href={"/profile/" + userUid}>
                <ThisImage/>
            </Link>
            :
            <ThisImage/>
        )
    )
}
