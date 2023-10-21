import { FC } from 'react'
import PoemCard from './PoemCard'

interface PostData {
    _id: string
    content: string
    author: {
        username: string
        firstName: string
        lastName: string
        profileImage: string
    }
    favorites: string[]
    createdAt: string
    updatedAt: string
    version: number
}


type Props = {
    poemData: Array<PostData>
}

const Feed: FC<Props> = ({ poemData }) => {
    return (
        <div className='w-full gap-3 p-4 columns-3 lg:columns-2 sm:flex sm:flex-col'>
            {poemData?.map((poem) => {
                return (
                    <div key={poem._id}>
                        <PoemCard
                            poem={poem.content}
                            profileImage={poem.author.profileImage}
                            firstName={poem.author.firstName}
                            lastName={poem.author.lastName}
                            username={poem.author.username}
                            favorites={poem.favorites}
                            createdAt={poem.createdAt}
                            updatedAt={poem.updatedAt}
                            _id={poem._id}
                        />
                    </div>
                )
            })}
        </div>)
}

export default Feed