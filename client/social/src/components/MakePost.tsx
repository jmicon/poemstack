import { useState, useEffect, useRef, FC, useContext } from 'react'
import { useAuth } from "@clerk/clerk-react";
import { PostsContext } from '../context/PostContext'

type Props = {
    author: string | undefined
}

const MakePost: FC<Props> = ({ author }: Props) => {
    const [post, setPost] = useState("")

    const textAreaRef = useRef<any>(null)

    const { getToken } = useAuth();

    const { addPost } = useContext(PostsContext)


    const resizeTextArea = () => {
        textAreaRef.current.style.height = "auto";
        textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
    };

    useEffect(resizeTextArea, [post])

    const makePost = async () => {
        const response = await fetch('http://localhost:3000/posts/new-post', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // https://clerk.com/docs/backend-requests/making/cross-origin#using-fetch-with-react
                Authorization: `Bearer ${await getToken()}`
            },
            body: JSON.stringify({
                content: post,
                author: author
            })
        })

        const data = await response.json()
        addPost(data)
        setPost("")
    }

    return (
        <>
            <div className='flex justify-center'>
                <textarea
                    rows={1}
                    placeholder='Make a post'
                    onChange={e => setPost(e.target.value)}
                    value={post}
                    className='shadow-lg max-w-xl w-full p-2 my-4 focus:outline-none mx-3 duration-500 resize-none'
                    ref={textAreaRef}
                />
                <div className='flex flex-col justify-center'>
                    <button className='px-3 py-1 border border-blue-400 text-blue-400 rounded-md min-w-[6rem] duration-150 hover:bg-blue-400 hover:text-white' onClick={makePost} > Post</button >
                </div>
            </div>
        </>
    )
}

export default MakePost
