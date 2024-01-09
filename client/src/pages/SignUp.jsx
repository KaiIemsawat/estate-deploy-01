import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OAuth from "../components/Oauth";

const SignUp = () => {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

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
        if (
            !formData.username ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            setError("Please fill in all fields");
            toast.error(error);
            setLoading(false);
            return;
        }

        if (formData.password === formData.confirmPassword) {
            setLoading(true);
            try {
                const res = await fetch("/api/auth/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                const data = await res.json();

                console.log("DATA", data);

                if (data.success === false) {
                    setLoading(false);
                    setError(data.message);

                    toast.error(data.message);
                    return;
                }
                setLoading(false);
                setError(null);
                toast.success("Your account has been created");
                navigate("/");
            } catch (error) {
                setLoading(false);
                setError(error.message);
                console.log(error.message);
            }
        } else {
            setLoading(false);
            toast.error("Passwords do not match");
        }
    };

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl text-end font-semibold text-primary-500 mt-7 mb-4">
                Sign Up
            </h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input
                    className="border p-3 rounded-lg focus:outline-none"
                    id="username"
                    type="text"
                    placeholder="username"
                    onChange={handleChange}
                />
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
                <input
                    className="border p-3 rounded-lg focus:outline-none"
                    id="confirmPassword"
                    type="password"
                    placeholder="confirm password"
                    onChange={handleChange}
                />
                <button
                    className="bg-primary-500 text-effect-300 p-3 rounded-lg uppercase hover:bg-effect-300 hover:text-primary-500 duration-200"
                    disabled={loading}
                >
                    {loading ? "Loading" : "Sign Up"}
                </button>
                <OAuth />
            </form>
            <div className="flex gap-2 mt-4">
                <p>
                    Have an account ? &nbsp;Please&nbsp;
                    <Link to={"/sign-in"}>
                        <span className="text-primary-500 hover:text-effect-300 duration-200 font-semibold">
                            sign in
                        </span>
                    </Link>
                </p>
            </div>
        </div>
    );
};
export default SignUp;
