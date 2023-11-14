import Feed from '../components/Feed'
import { FC, useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { SignedIn, useUser, useAuth } from "@clerk/clerk-react";
import MakePost from '../components/MakePost'
import useFetch from '../hooks/useFetch';
import { PostsContext } from '../context/PostContext'
import InfiniteScroll from 'react-infinite-scroll-component';


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

interface UserData {
    _id: string
    username: string
    following: string[]
    followers: string[]
    bio: string
    firstName: string
    lastName: string
    profileImage: string
    createdAt: string
    updatedAt: string
    favorites: string[]
}

const Profile: FC = () => {
    let { username } = useParams();
    const { isLoaded: userLoaded, user } = useUser();
    const { isLoaded: authLoaded } = useAuth();

    const [, setCurrentUser] = useState(false)
    const [feedPage, setFeedPage] = useState(0)

    const navigate = useNavigate();

    const { posts, currentPostsURL, getPosts, addNewPagePosts } = useContext(PostsContext)

    useEffect(() => {
        getPosts(`${import.meta.env.VITE_API}/posts/single-user-posts/${username}`, `${import.meta.env.VITE_API}/posts/single-user-posts`)
    }, [])

    useEffect(() => {
        if (username === user?.username) setCurrentUser(true)
    }, [authLoaded, userLoaded])

    const [poemData] = useFetch<PostData[] | []>(`${import.meta.env.VITE_API}/posts/single-user-posts/${username}`, [])

    const [userData] = useFetch<UserData | Object>(`${import.meta.env.VITE_API}/users/single-user-data/${username}`, {})

    const fetchMorePosts = (url: string) => {
        const nextPage = feedPage + 1
        setFeedPage(prevFeedPage => prevFeedPage + 1)
        // console.log(feedPage, nextPage);
        const newPage = async () => {
            const response = await fetch(`${url}?p=${nextPage}`)
            const data = await response.json()
            addNewPagePosts(data)
        }
        newPage()
    }

    return (
        <div className='absolute h-full bg-gradient-to-r from-transparent via-blue-50 to-transparent w-full'>
            <section className='max-w-[1279px] m-auto'>
                <Navbar />
                <div className='flex flex-col items-center mx-auto mb-4 max-w-lg'>
                    <div>
                        <img src={(userData as UserData).profileImage} alt="profile picture" width='100px' className='mx-2 grid-cols rounded-full drop-shadow-sm cursor-pointer aspect-square object-cover' />
                    </div>
                    <SignedIn>
                        {userLoaded && user?.username === username ? <button onClick={() => navigate('/user/settings')} className='px-3 py-1 my-3 border border-blue-400 text-blue-400 rounded-md min-w-[6rem] duration-150 hover:bg-blue-400 hover:text-white'>Edit Profile</button> : <></>}
                    </ SignedIn>
                    <div className='text-2xl'>{(userData as UserData).firstName}</div>
                    <div className='text-slate-500 mb-4'>@{(userData as UserData).username}</div>
                    <div className='px-4'>{(userData as UserData).bio}</div>
                </div>
                <div>
                    <h1 className='flex justify-center text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text antialiased'>Poems</h1>
                    <div className='border black my-5' />
                    <SignedIn>
                        {userLoaded && user?.username === username ? <MakePost author={user?.username} /> : <></>}
                    </ SignedIn>

                    <>
                        <InfiniteScroll
                            dataLength={poemData.length}
                            next={() => fetchMorePosts(currentPostsURL)}
                            hasMore={true}
                            loader={<h4 style={{ textAlign: 'center' }}>.</h4>}
                            endMessage={
                                <p style={{ textAlign: 'center' }}>
                                    <b>You have seen everything!</b>
                                </p>
                            }
                        >
                            {posts.length === 0 ? <div className='text-xl flex justify-center'>No posts</div> : <Feed poemData={posts} />}
                        </InfiniteScroll>
                    </>
                </div>
            </ section>
        </div>
    )
}

export default Profile