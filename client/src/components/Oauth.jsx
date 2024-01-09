import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";

import { app } from "../firebase";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),
            });

            // convert to json and save as 'data'
            // Then dispatch
            const data = await res.json();
            console.log(data);
            dispatch(signInSuccess(data));
            navigate("/");
        } catch (error) {
            console.log("Unable to sign in with GOOGLE", error);
        }
    };
    return (
        <button
            className="bg-optional-400 text-primary-500 p-3 rounded-lg uppercase hover:bg-effect-300 hover:text-primary-500 duration-200"
            type="button"
            onClick={handleGoogleClick}
        >
            CONTINUE WITH GOOGLE
        </button>
    );
}
export default OAuth;
