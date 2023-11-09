import PoemCard from '../components/PoemCard'
import { useParams } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import Navbar from '../components/Navbar'

interface PostData {
    _id: string
    content: string
    author: {
        _id: string
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

interface PostError {
    error: string
}

const Post = () => {
    let { postID } = useParams()

    const [poemData, poemLoading] = useFetch<PostData | PostError | {}>(`${import.meta.env.VITE_API}/posts/single/${postID}`, {})

    return (
        <>
            <Navbar />
            <div className='flex justify-center'>
                <div className='w-[600px] my-6 mx-4'>
                    {!poemLoading &&
                        <>
                            {!poemLoading && !(poemData as PostError).error ?
                                <PoemCard
                                    poem={(poemData as PostData).content}
                                    profileImage={(poemData as PostData).author.profileImage}
                                    firstName={(poemData as PostData).author.firstName}
                                    lastName={(poemData as PostData).author.lastName}
                                    username={(poemData as PostData).author.username}
                                    favorites={(poemData as PostData).favorites}
                                    createdAt={(poemData as PostData).createdAt}
                                    updatedAt={(poemData as PostData).updatedAt}
                                    _id={(poemData as PostData)._id}
                                />
                                : <div>Post not found</div>}
                        </>
                    }
                </div>
            </div>
        </>
    )
}

export default Post