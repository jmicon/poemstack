import React, { createContext, useState } from 'react';

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

interface Values {
    posts: PostData[]
    currentPostsURL: string
    addPost: (newPost: PostData) => void
    getPosts: (url: string, rawURL: string) => Promise<void>
    addNewPagePosts: (newPosts: PostData[]) => void
    deleteOnePost: (id: string) => void
    getNewPagePosts: (url: string, pageNumber: number, searchContent?: string) => Promise<void>
}

export const PostsContext = createContext<Values>(null);

type ContextProviderProps = {
    children: React.ReactNode
}


export function PostsProvider({ children }: ContextProviderProps) {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [currentPostsURL, setCurrentPostsURL] = useState<string>("");

    const addPost = (newPost: PostData) => {
        setPosts([newPost, ...posts]);
    };

    const getPosts = async (url: string, rawURL: string) => {
        const response = await fetch(url)

        const postData = await response.json()
        setPosts(postData)
        setCurrentPostsURL(rawURL)
    }

    const addNewPagePosts = (newPosts: PostData[]) => {
        setPosts(posts.concat(newPosts))
    }

    const getNewPagePosts = async (url: string, pageNumber: number, searchContent?: string) => {
        // if (!!searchContent) {
        //     const response = await fetch(`${url}?p=${pageNumber}&s=${searchContent}`)
        //     const postData = await response.json()
        //     setPosts(posts.concat(postData))
        // }
        const response = await fetch(`${url}?p=${pageNumber}&s=${searchContent}`)
        const postData = await response.json()
        setPosts(posts.concat(postData))
    }


    const deleteOnePost = (postID: string) => {
        const updatedPosts = posts.filter(post => post._id !== postID)
        setPosts(updatedPosts)
    }

    return (
        <PostsContext.Provider value={{ posts, currentPostsURL, addPost, getPosts, addNewPagePosts, deleteOnePost, getNewPagePosts }}>
            {children}
        </PostsContext.Provider>
    );
}

