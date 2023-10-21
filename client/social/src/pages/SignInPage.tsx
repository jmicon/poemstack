import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
    return (
        <div className="flex justify-center w-full items-center h-screen">
            <SignIn />;
        </div>
    )
}