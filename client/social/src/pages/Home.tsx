import { useState, useEffect, useContext } from 'react'
import Feed from '../components/Feed'
import Navbar from '../components/Navbar'
import useFetch from '../hooks/useFetch'
import InfiniteScroll from 'react-infinite-scroll-component'
import { PostsContext } from '../context/PostContext'

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

export default function Home() {

    const [feedPage, setFeedPage] = useState(0)
    const [searchText, setSearchText] = useState("")

    const [postData] = useFetch<PostData[] | []>(`${import.meta.env.VITE_API}/posts/all-recent-posts?p=0`, [])

    const { posts, currentPostsURL, getPosts, addNewPagePosts } = useContext(PostsContext)

    useEffect(() => {
        setFeedPage(0)
        getPosts(`${import.meta.env.VITE_API}/posts/all-recent-posts?p=${feedPage}`, `${import.meta.env.VITE_API}/posts/all-recent-posts`)
    }, [])

    useEffect(() => {
        setFeedPage(0)
        getPosts(`${import.meta.env.VITE_API}/posts/search?p=${feedPage}&s=${searchText}`, `${import.meta.env.VITE_API}/posts/search`)
    }, [searchText])

    const fetchMorePosts = (url: string) => {
        const nextPage = feedPage + 1
        setFeedPage(prevFeedPage => prevFeedPage + 1)
        // console.log(feedPage, nextPage);
        const newPage = async () => {
            const response = await fetch(`${url}?p=${nextPage}&s=${searchText}`)
            const data = await response.json()
            addNewPagePosts(data)
        }
        newPage()
    }

    return (
        <section className='max-w-[1279px] m-auto h-full bg-gradient-to-r from-transparent via-blue-50 to-transparent w-full'>
            <Navbar />
            <div className='flex center content-center flex-col text-center max-w-3xl m-auto px-1'>
                <h1 className='text-6xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text antialiased mt-4 sm:text-4xl md:text-5xl'> <span>Discover and Share</span><br />Short Poems</h1>
                <p className='my-4'></p>
                <div className='flex justify-center' >
                    <input
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        className='shadow-lg  max-w-xl w-full px-2 py-4 mt-6 focus:outline-cyan-500 mx-3'
                        type="text"
                        placeholder='Search poems'
                    />
                </div>
            </div>

            <div className='mt-12'>
                {/* Feed */}
                <h1 className='text-center text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text antialiased md:text-3xl'>{!!searchText ? 'Results' : 'Recent'}</h1>
                <InfiniteScroll
                    dataLength={postData.length}
                    next={() => fetchMorePosts(currentPostsURL)}
                    hasMore={true}
                    loader={<h4 style={{ textAlign: 'center' }}>.</h4>}
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                            <b>You have seen everything!</b>
                        </p>
                    }
                >
                    <Feed
                        poemData={posts}
                    />
                </InfiniteScroll>

            </div>

        </section>
    )
}