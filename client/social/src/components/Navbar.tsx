import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, useUser, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
    const navigate = useNavigate();

    const { user } = useUser();

    return (
        <nav className="flex justify-between px-3 py-1 max-w-[1279px] m-auto">
            <div
                onClick={() => navigate('/')}
                className="flex items-center cursor-pointer"
            >
                <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12.998 2.04938C18.0514 2.5511 21.998 6.81465 21.998 12V13H12.998V19C12.998 20.1046 13.8935 21 14.998 21C16.1026 21 16.998 20.1046 16.998 19V18H18.998V19C18.998 21.2091 17.2072 23 14.998 23C12.7889 23 10.998 21.2091 10.998 19V13H1.99805V12C1.99805 6.81465 5.94472 2.5511 10.998 2.04938V2C10.998 1.44772 11.4458 1 11.998 1C12.5503 1 12.998 1.44772 12.998 2V2.04938ZM19.9362 11C19.4441 7.05369 16.0777 4 11.998 4C7.91843 4 4.55204 7.05369 4.05994 11H19.9362Z" fill="rgba(0,0,0,1)"></path></svg>
                Poemstack
            </div>
            <SignedOut>
                <div>
                    <button className="px-3 py-2 m-2 border border-blue-400 text-blue-400 rounded-md min-w-[6rem] duration-150 hover:bg-blue-400 hover:text-white" onClick={() => navigate('/signin')}>Sign in</button>
                    <button className="px-3 py-2 m-2 border border-blue-400 text-blue-400 rounded-md min-w-[6rem] duration-150 hover:bg-blue-400 hover:text-white" onClick={() => navigate('/signup')}>Register</button>
                </div>
            </SignedOut>

            <SignedIn>
                <div className="flex items-center">
                    <div onClick={() => navigate(`/profile/${user?.username}`)} className="mr-3 cursor-pointer hover:text-sky-700 duration-150" >{user?.username}</div>
                    <UserButton />
                </div>
            </ SignedIn>

        </nav>
    )
}

export default Navbar