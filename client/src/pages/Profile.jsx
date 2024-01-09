import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import { app } from "../firebase.js";
import {
    deleteUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    signoutUserFailure,
    signoutUserStart,
    signoutUserSuccess,
    updateUserFailure,
    updateUserStart,
    updateUserSuccess,
} from "../redux/user/userSlice.js";

const Profile = () => {
    const { currentUser, loading, error } = useSelector((state) => state.user);

    const [file, setFile] = useState(undefined);
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({});
    const [showSuccessfulMsg, setShowSuccessfulMsg] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [showListingError, setShowListingError] = useState(false);
    const [userListings, setUserListings] = useState([]);

    const dispatch = useDispatch();

    const fileRef = useRef(null);

    const handleFileUpload = (file) => {
        const storage = getStorage(app); // 'app' comes from 'firebase.js'
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const upLoadTask = uploadBytesResumable(storageRef, file);

        upLoadTask.on(
            "state_changed",
            (snapshot) => {
                setFileUploadError(false);
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadPercentage(Math.round(progress));
            },
            (error) => {
                setFileUploadError(true);
            },
            () => {
                getDownloadURL(upLoadTask.snapshot.ref).then((downloadURL) => {
                    setFormData({ ...formData, avatar: downloadURL });
                });
            }
        );
    };

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    useEffect(() => {
        if (uploadPercentage === 100) {
            setShowSuccessfulMsg(true);

            const timeout = setTimeout(() => {
                setShowSuccessfulMsg(false);
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [uploadPercentage]);

    useEffect(() => {
        if (updateSuccess) {
            const timeout = setTimeout(() => {
                setUpdateSuccess(false);
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [updateSuccess]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.success === false) {
                dispatch(updateUserFailure(data.message));
                return;
            }
            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
        } catch (error) {
            dispatch(updateUserFailure(error.message));
        }
    };

    const handleDeleteUser = async () => {
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: "DELETE",
            });

            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                toast.error(error.message);
                return;
            }
            dispatch(deleteUserSuccess(data));
            toast.success("Account has been deleted");
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
            toast.error(error.message);
        }
    };

    const handleSignout = async () => {
        try {
            dispatch(signoutUserStart());
            const res = await fetch("/api/auth/signout");
            const data = await res.json();
            if (data.success === false) {
                dispatch(signoutUserFailure(data.message));
                toast.error(error.message);
                return;
            }
            dispatch(signoutUserSuccess(data));
            toast.success("You have signed out");
        } catch (error) {
            dispatch(signoutUserFailure(error.message));
            toast.error(error.message);
        }
    };

    const handleShowListings = async () => {
        try {
            setShowListingError(false);

            const res = await fetch(`/api/user/listings/${currentUser._id}`);
            const data = await res.json();

            if (data.success === false) {
                setShowListingError(true);
                toast.error(error.message);
                return;
            }

            setUserListings(data);
        } catch (error) {
            setShowListingError(true);
            toast.error(error.message);
        }
    };

    const handleCloseListing = async () => {
        await setUserListings([]);
    };

    const handleListingDelete = async (listingId) => {
        try {
            const res = await fetch(`api/listing/delete/${listingId}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                toast.error(error.message);
                return;
            }
            // Update user listing list
            setUserListings((prev) =>
                prev.filter((listing) => listing._id !== listingId)
            );
        } catch (error) {
            toast.error(error.message);
            console.log(error.message);
        }
    };

    return (
        <div className="p-3 max-w-lg mx-auto">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex justify-between mt-7 mb-4 items-center">
                    <div className="flex gap-3 items-center">
                        {/* Hidden input that will take effect when image is clicked  */}
                        <input
                            onChange={(e) => setFile(e.target.files[0])}
                            // [0] to allow only one (first) file
                            type="file"
                            ref={fileRef}
                            hidden
                            accept="image/*"
                        />
                        <img
                            className="rounded-full h-24 w-24 object-cover cursor-pointer"
                            src={formData.avatar || currentUser.avatar}
                            alt="profile img"
                            onClick={() => fileRef.current.click()}
                        />

                        {/* UPLOAD MESSAGES */}
                        <p>
                            {fileUploadError ? (
                                <>
                                    <p className="text-error text-sm font-semibold">
                                        Image uploading error.
                                    </p>
                                    <p className="text-error text-sm font-semibold">
                                        Please try another file.
                                    </p>
                                </>
                            ) : uploadPercentage > 0 &&
                              uploadPercentage < 100 ? (
                                <span className="text-effect-500 text-sm font-semibold">
                                    {uploadPercentage} % upload
                                </span>
                            ) : (
                                showSuccessfulMsg && (
                                    <span className="text-effect-500 text-sm font-semibold">
                                        File successfully uploaded
                                    </span>
                                )
                            )}
                        </p>
                    </div>
                    <h1 className="text-3xl text-end font-semibold text-primary-500">
                        {currentUser.username}
                    </h1>
                </div>
                <input
                    className="border p-3 rounded-lg focus:outline-none"
                    id="username"
                    type="text"
                    placeholder="username"
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                />
                <input
                    className="border p-3 rounded-lg focus:outline-none"
                    id="email"
                    type="text"
                    placeholder="email"
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                />
                <input
                    className="border p-3 rounded-lg focus:outline-none"
                    id="password"
                    type="password"
                    placeholder="password"
                    onChange={handleChange}
                />

                {/* BUTTON */}
                {loading ? (
                    <button
                        className="bg-primary-500 text-effect-300 p-3 rounded-lg uppercase"
                        disabled
                    >
                        Loading...
                    </button>
                ) : updateSuccess ? (
                    <button
                        className="bg-primary-500 text-effect-300 p-3 rounded-lg uppercase"
                        disabled
                    >
                        details Updated
                    </button>
                ) : (
                    <button className="bg-primary-500 text-effect-300 p-3 rounded-lg uppercase hover:bg-effect-300 hover:text-primary-500 duration-200">
                        Update
                    </button>
                )}
            </form>

            {/* ERROR MESSAGE */}
            {error ? (
                <div className="mt-2 text-end">
                    <p className="text-error text-sm font-semibold">{error}</p>
                </div>
            ) : null}

            {/* CREATE LISTING BTN */}
            <div className="flex mt-5 mb-4">
                <Link
                    className="bg-optional-400 text-primary-500 p-3 rounded-lg uppercase hover:bg-effect-300 hover:text-primary-500 duration-200 w-full text-center"
                    to="/create-listing"
                >
                    Create Listing
                </Link>
            </div>

            {/* SHOW LISTING */}
            <div className="flex mt-5 mb-4 flex-col gap-6">
                {userListings.length === 0 ? (
                    <button
                        className="border border-optional-400 text-optional-500 p-3 rounded-lg uppercase hover:bg-optional-400  hover:text-effect-300 duration-200 w-full text-center"
                        onClick={handleShowListings}
                    >
                        Show Listings
                    </button>
                ) : (
                    <button
                        className="border border-optional-400 text-optional-500 p-3 rounded-lg uppercase hover:bg-optional-400  hover:text-effect-300 duration-200 w-full text-center"
                        onClick={handleCloseListing}
                    >
                        Close Listing
                    </button>
                )}

                {userListings &&
                    userListings.length > 0 &&
                    userListings.map((listing) => (
                        <div
                            key={listing._id}
                            className="border border-secondary-300 p-2 rounded-lg flex justify-between"
                        >
                            <div className="flex gap-4">
                                <Link to={`/listing/${listing._id}`}>
                                    <img
                                        className="h-24 w-36 object-cover rounded-md"
                                        src={listing.imageUrls[0]}
                                        alt="listingImageCover"
                                    />
                                </Link>
                                <div>
                                    <Link to={`/listing/${listing._id}`}>
                                        <p className="text-primary-500 font-semibold text-md hover:text-effect-300 overflow-hidden truncate w-32 sm:w-52">
                                            {listing.name}
                                        </p>
                                    </Link>
                                    <p className="text-secondary-400 font-light text-sm overflow-hidden truncate w-32 sm:w-52">
                                        <span className="text-secondary-400 font-semibold">
                                            Location :
                                        </span>
                                        &nbsp;{listing.address}
                                    </p>
                                    <p className="text-secondary-400 font-light text-sm">
                                        {listing.bedrooms}&nbsp;
                                        <span className="text-secondary-400 font-semibold">
                                            {listing.bedrooms > 1
                                                ? "bedrooms"
                                                : "bedroom"}
                                        </span>
                                    </p>
                                    <p className="text-secondary-400 font-light text-sm">
                                        {listing.bathrooms}&nbsp;
                                        <span className="text-secondary-400 font-semibold">
                                            {listing.bathrooms > 1
                                                ? "bathrooms"
                                                : "bathroom"}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col justify-between">
                                <Link to={`/update-listing/${listing._id}`}>
                                    <button className="border border-optional-400 text-optional-500 px-3 py-2 rounded-md uppercase hover:bg-optional-400  hover:text-effect-300 duration-200 w-full text-center">
                                        Edit
                                    </button>
                                </Link>
                                <button
                                    className="border border-error text-error px-3 py-2 rounded-md uppercase hover:bg-error  hover:text-effect-300 duration-200 w-full text-center"
                                    onClick={() =>
                                        handleListingDelete(listing._id)
                                    }
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
            </div>

            {/* DELETE ACCOUNT / SIGNOUT */}
            <div className="flex justify-between mt-5">
                <span
                    className="text-secondary-300 hover:text-error duration-200 cursor-pointer"
                    onClick={handleDeleteUser}
                >
                    Delete Account
                </span>
                <span
                    className="text-secondary-300 hover:text-warning duration-200 cursor-pointer"
                    onClick={handleSignout}
                >
                    Sign out
                </span>
            </div>
        </div>
    );
};
export default Profile;

/* firebase storage rules */
// allow read;
// allow write: if
// request.resource.size < 2 * 1024 * 1024 &&
// request.resource.contentType.matches('image/.*')
