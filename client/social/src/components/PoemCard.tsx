import React, { FC, useContext, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { PostsContext } from '../context/PostContext';
// props createdAt, updatedAt

type Props = {
    poem: string
    profileImage: string
    firstName: string
    lastName: string
    username: string
    favorites: string[]
    createdAt: string
    updatedAt: string
    _id: string
}

const PoemCard: FC<Props> = ({ poem, profileImage, firstName, lastName, username, favorites, _id }) => {
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const { isLoaded: userLoaded, user } = useUser();
    const [favorited, setFavorited] = useState(false)
    // const [menu, setMenu] = useState(false)
    const [copied, setCopied] = useState(false)

    const { deleteOnePost } = useContext(PostsContext)

    // const [favoriteState, setFavoriteState] = useState(favorites.length)
    const [favoriteState, setFavoriteState] = useState(favorites)

    useEffect(() => {
        const getCurrentUser = async () => {
            const response = await fetch(`${import.meta.env.VITE_API}/users/single-user-data-auth/${user?.username}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${await getToken()}`,
                    mode: "cors"
                }
            })
            if (!response.ok) return console.error("Error fetching data");

            const data = await response.json()
            if (data && data.favoritedPosts.includes(_id)) {
                setFavorited(true)
            }
            else {
                setFavorited(false)
            }
        }
        getCurrentUser()
    }, [userLoaded])

    const favoritePost = async () => {
        const response = await fetch(`${import.meta.env.VITE_API}/posts/favorite-post`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${await getToken()}`,
                mode: "cors"

            },
            body: JSON.stringify({
                postID: _id,
                username: user?.username
            })
        })
        const data = await response.json()
        if (!data.addToPostFavorites) {
            setFavorited(false)
            setFavoriteState(data.removeFromPostFavorites.favorites)
            // setFavoriteState(favoriteState - 1)
        }
        if (data.addToPostFavorites) {
            setFavorited(true)
            setFavoriteState(data.addToPostFavorites.favorites)
            // setFavoriteState(favoriteState + 1)
        }
    }

    const deletePost = async () => {
        const response = await fetch(`${import.meta.env.VITE_API}/posts/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${await getToken()}`,
                mode: "cors"
            },
            body: JSON.stringify({
                postID: _id,
                username: user?.username
            })

        })
        const data = await response.json()
        deleteOnePost(data._id)
    }

    const cardClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        event.stopPropagation()
    }
    return (
        <div className='border border-zinc-300 min-h-[8rem] rounded p-2 duration-75 hover:bg-blue-50 bg-transparent ease-in-out break-inside-avoid mb-3 cursor-pointer' onClick={() => {
            navigate(`/post/${_id}`)
        }}>
            <div className='flex justify-between'>
                <div className='flex mb-2'>
                    <img src={profileImage} alt="profile-img" width='50px' height='auto' className='mx-2 grid-cols rounded-full drop-shadow-md cursor-pointer aspect-square object-cover hover:opacity-80 hover:scale-105 duration-100 ' onClick={e => {
                        navigate(`/profile/${username}`)
                        cardClick(e)
                    }} />
                    <div className='mx-2 flex flex-col'>
                        <div className='cursor-pointer hover:opacity-75' onClick={e => {
                            navigate(`/profile/${username}`)
                            cardClick(e)
                        }}>{firstName} {lastName}</div>
                        <div className='text-slate-500 cursor-pointer hover:text-slate-400 duration-75' onClick={e => {
                            navigate(`/profile/${username}`)
                            cardClick(e)
                        }}>@{username}</div>
                    </div>
                </div>
                {/* Delete Button */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="duration-200 fill-slate-500 hover:fill-red-600 relative" onClick={e => {
                    deletePost()
                    cardClick(e)
                }}>
                    <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
                </svg>
            </div>
            <p>{poem}</p>

            <div className='my-2 flex justify-between'>
                <div className='flex items-center' >
                    {/* Favorite Button */}
                    <svg onClick={e => {
                        favoritePost()
                        // setFavorited(!favorited)
                        cardClick(e)
                    }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#475569" className={`${!!favorited ? 'fill-sky-300 stroke-sky-300 hover:fill-none hover:stroke-black ease-in' : 'fill-none'} w-6 h-6 duration-200 hover:fill-sky-300 hover:stroke-sky-300 ease-out inline`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                    <span className='ml-1'>{favoriteState && favoriteState.length}</span>
                </div>
                <div className='relative cursor-pointer' onClick={e => {
                    cardClick(e)
                }}>
                    {/* <div className={`${!menu ? 'hidden' : 'visible'} absolute`}> */}
                    {/* Share Button */}
                    <div className='relative flex justify-center'>
                        <div className={`${copied ? 'opacity-80 bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 'opacity-0 bg-gradient-to-br from-transparent to-cyan-500 text-transparent'} text-transparent rounded-lg duration-300 ease-in-out absolute bottom-7 right-0 p-2 w-28 text-center`}>Link copied</div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 duration-200 stroke-slate-600 hover:stroke-slate-400" onClick={e => {
                            cardClick(e)
                            navigator.clipboard.writeText(`${import.meta.env.VITE_SITE_URL}/${_id}`)
                            setCopied(true)
                            setTimeout(() => {
                                setCopied(false)
                            }, 1500);
                        }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PoemCard