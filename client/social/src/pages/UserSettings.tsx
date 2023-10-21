import { UserProfile } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";

const UserSettings = () => {
    return (
        <div className="max-w-[1279px] m-auto">
            <Navbar />
            <div className="flex justify-center my-6">
                <UserProfile />
            </div>
        </div>
    )
}

export default UserSettings