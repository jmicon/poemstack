import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import App from './App.tsx'
import './index.css'
import { ClerkProvider } from "@clerk/clerk-react";
import { PostsProvider } from './context/PostContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <BrowserRouter>
        <PostsProvider>
          <App />
        </PostsProvider>
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>,
)
