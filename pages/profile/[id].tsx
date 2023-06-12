import Layout from '@/components/Layout'
import User from '@/types/User'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/router'
import React from 'react'
import profile from "../../public/images/profile.jpg"
import ProfileImage from '@/components/ProfileImage'
import "../../app/utils.css"

type Props = {
  user: User
}


function ProfileHeader({ user }: { user: User }) {
  return (
    <div className='flex-1 rounded-md color-split-1 sm:grow-[0.8] '>
      <div className='p-4 pl-4 pr-4 sm:pl-8 sm:pr-8'>
        <div className='h-32 w-32 border-white border-8 rounded-full flex gap-7 items-center'>
          <ProfileImage profileImage={user.profileImage} />
          <div className="text-darkblue text-xl font-semibold">
            {
              user.name
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Profile({ user }: Props) {
  return (
    <Layout>
      <div className='flex justify-center'>
        <ProfileHeader user={user} />
      </div>
    </Layout>
  )
}

export async function getServerSideProps(context: any) {
  const { id } = context.params
  // here we get the user using the id, or the fake user in this case
  const user = {
    uid: "123",
    name: "Jeff",
    profileImage: profile,
  }

  return { props: { user } }
}

