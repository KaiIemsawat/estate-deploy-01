import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Header = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const { currentUser } = useSelector((state) => state.user);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // asssign searchTerm value from params
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("searchTerm", searchTerm);
        const searchQuery = urlParams.toString();

        navigate(`/search?${searchQuery}`);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get("searchTerm");
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

    return (
        <header className="bg-secondary-100 shadow-md">
            <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
                <Link to="/">
                    <h1 className="font-bold text-md sm:text-xl flex flex-wrap">
                        <span className="text-primary-500">Zukkii</span>
                        <span className="text-primary-800">Estate</span>
                    </h1>
                </Link>
                <form
                    className="bg-secondary-50 p-3 rounded-lg flex items-center"
                    onSubmit={handleSubmit}
                >
                    <input
                        className="bg-transparent focus:outline-none w-24 sm:w-64"
                        type="text"
                        placeholder="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button>
                        <FaSearch className="text-primary-500" />
                    </button>
                </form>
                <ul className="flex gap-4">
                    <Link to="/">
                        <li className="hidden sm:inline text-primary-500 hover:text-effect-300 duration-200">
                            Home
                        </li>
                    </Link>
                    <Link to="/about">
                        <li className="hidden sm:inline text-primary-500 hover:text-effect-300 duration-200">
                            About
                        </li>
                    </Link>
                    {currentUser ? (
                        <Link to="/profile">
                            <img
                                className="rounded-full h-7 w-7 object-cover"
                                src={currentUser.avatar}
                                alt="profile"
                            ></img>
                        </Link>
                    ) : (
                        <Link to="/sign-in">
                            <li className="sm:inline text-primary-500 hover:text-effect-300 duration-200">
                                Sign in
                            </li>
                        </Link>
                    )}
                </ul>
            </div>
        </header>
    );
};
export default Header;
