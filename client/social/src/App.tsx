import { Route, Routes } from "react-router-dom"
import Home from './pages/Home'
import Profile from "./pages/Profile"
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import UserProfilePage from "./pages/ProfileSettings";
import UserSettings from "./pages/UserSettings";
import Post from "./pages/Post";

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/profile/:username' element={<Profile />} />
        <Route path='/signin' element={<SignInPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/userprofilepage' element={<UserProfilePage />} />
        <Route path='/user/settings' element={<UserSettings />} />
        <Route path='/post/:postID' element={<Post />} />
      </Routes>
    </>
  )
}

export default App
