import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
    signInStart,
    signInSuccess,
    signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/Oauth";

const SignIn = () => {
    const [formData, setFormData] = useState({});
    // const [error, setError] = useState(null);
    // const [loading, setLoading] = useState(false);

    const { loading, error } = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Handle empty fields
        if (!formData.email || !formData.password) {
            // setError("Please fill in all fields");
            toast.error("Please fill in all fields");
            setLoading(false);
            return;
        }

        // setLoading(true); // switch to 'dispatch(signInStart())'
        dispatch(signInStart());
        try {
            const res = await fetch("/api/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success === false) {
                // setLoading(false);
                // setError(data.message);
                // switch to 'dispatch(signInFailure(data.message))'
                dispatch(signInFailure(data.message));

                toast.error(data.message);
                return;
            }
            // setLoading(false);
            // setError(null);
            // switch to 'dispatch(signInSuccess(data))'
            dispatch(signInSuccess(data));
            toast.success(`Welcome back ${data.username}`);
            navigate("/");
        } catch (error) {
            // setLoading(false);
            // setError(error.message);
            // switch to 'dispatch(signInFailure(error.message))'
            dispatch(signInFailure(error.message));
            console.log(error.message);
        }
    };

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl text-end font-semibold text-primary-500 mt-7 mb-4">
                Sign In
            </h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input
                    className="border p-3 rounded-lg focus:outline-none"
                    id="email"
                    type="email"
                    placeholder="email"
                    onChange={handleChange}
                />
                <input
                    className="border p-3 rounded-lg focus:outline-none"
                    id="password"
                    type="password"
                    placeholder="password"
                    onChange={handleChange}
                />

                <button
                    className="bg-primary-500 text-effect-300 p-3 rounded-lg uppercase hover:bg-effect-300 hover:text-primary-500 duration-200"
                    disabled={loading}
                >
                    {loading ? "Loading" : "Sign In"}
                </button>
                <OAuth />
            </form>
            <div className="flex gap-2 mt-4">
                <p>
                    Need an account ? &nbsp;Please&nbsp;
                    <Link to={"/sign-up"}>
                        <span className="text-primary-500 hover:text-effect-300 duration-200 font-semibold">
                            register
                        </span>
                    </Link>
                </p>
            </div>
        </div>
    );
};
export default SignIn;
