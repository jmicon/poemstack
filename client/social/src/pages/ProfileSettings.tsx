import { UserProfile } from "@clerk/clerk-react";

const UserProfilePage = () => (
    <UserProfile path="/user-profile" routing="path" />
);

export default UserProfilePage;