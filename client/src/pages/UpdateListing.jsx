import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { app } from "../firebase";
import { toast } from "react-toastify";

const UpdateListing = () => {
    const { currentUser } = useSelector((state) => state.user);

    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: "",
        description: "",
        address: "",
        regularPrice: 1500,
        discountPrice: 0,
        type: "rent",
        bathrooms: 1,
        bedrooms: 1,
        furnished: false,
        parking: false,
        offer: false,
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId; // params.thisName 'thisName' needs to be the same as in 'App.jsx'
            const res = await fetch(`/api/listing/get/${listingId}`);

            const data = await res.json();
            setFormData(data);

            if (data.success === false) {
                setError(data.message);
                console.log("DATA -- ", data);
                toast.error(error.message);
                console.log("ERROR -- ", error);
                return;
            }
            setFormData(data);
        };
        fetchListing();
    }, []);

    let numOfFiles = formData.imageUrls.length;

    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises)
                .then((urls) => {
                    setFormData({
                        ...formData,
                        imageUrls: formData.imageUrls.concat(urls),
                    });
                    setImageUploadError(false);
                    setUploading(false);
                })
                .catch((err) => {
                    setImageUploadError(
                        "Image upload failed (2mb max per image)"
                    );
                    setUploading(false);
                    toast.error("Image upload failed (2mb max per image)");
                    setFiles([]);
                });
        } else {
            setImageUploadError(
                "The number of upload images allowed is 1 to 6"
            );
            toast.error("The number of upload images allowed is 1 to 6");
            setFiles([]);
            setUploading(false);
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadURL) => {
                            resolve(downloadURL);
                        }
                    );
                }
            );
        });
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        });
    };

    const handleChange = (e) => {
        if (e.target.id === "sale" || e.target.id === "rent") {
            setFormData({
                ...formData,
                type: e.target.id,
            });
        }

        if (
            e.target.id === "parking" ||
            e.target.id === "furnished" ||
            e.target.id === "offer"
        ) {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            });
        }

        if (
            e.target.type === "number" ||
            e.target.type === "text" ||
            e.target.type === "textarea"
        ) {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // handle no image added
            if (formData.imageUrls.length < 1) {
                toast.error("You must upload at least an image");
                return setError("You must upload at least an image");
            }
            // handle discount price higher than reg price
            if (+formData.regularPrice < +formData.discountPrice) {
                toast.error(
                    "Discount price can't be higher than regular price"
                );
                return setError(
                    "Discount price can't be higher than regular price"
                );
            }

            setLoading(true);
            setError(false);
            const res = await fetch(`/api/listing/update/${params.listingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...formData, userRef: currentUser._id }),
            });
            const data = await res.json();
            setLoading(false);

            if (data.success === false) {
                console.log(data);
                setError(data.message);
                toast.error(data.message);
            }

            navigate(`/listing/${data._id}`);
        } catch (error) {
            setError(error.message);
            toast.error(error.message);
            setLoading(false);
        }
    };

    return (
        <main className="p-3 max-w-4xl mx-auto">
            <h1 className="text-3xl text-end font-semibold text-primary-500 mt-7 mb-4">
                Update Listing
            </h1>
            <form className="flex flex-col" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                    {/* Fields */}
                    <input
                        className="border p-3 rounded-lg focus:outline-none"
                        id="name"
                        type="text"
                        placeholder="name"
                        maxLength="60"
                        minLength="2"
                        required
                        onChange={handleChange}
                        value={formData.name}
                    />
                    <textarea
                        className="border p-3 rounded-lg focus:outline-none"
                        id="description"
                        type="text"
                        placeholder="description"
                        required
                        onChange={handleChange}
                        value={formData.description}
                    />
                    <input
                        className="border p-3 rounded-lg focus:outline-none"
                        id="address"
                        type="text"
                        placeholder="address"
                        required
                        onChange={handleChange}
                        value={formData.address}
                    />

                    {/* Checkboxes */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-2">
                        <div className="flex gap-2">
                            <input
                                className="w-5"
                                type="checkbox"
                                id="sale"
                                onChange={handleChange}
                                checked={formData.type === "sale"}
                            />
                            <span className="text-primary-500 font-semibold">
                                Sell
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                className="w-5"
                                type="checkbox"
                                id="rent"
                                onChange={handleChange}
                                checked={formData.type === "rent"}
                            />
                            <span className="text-primary-500 font-semibold">
                                Rent
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                className="w-5"
                                type="checkbox"
                                id="parking"
                                onChange={handleChange}
                                checked={formData.parking}
                            />
                            <span className="text-primary-500 font-semibold">
                                Parking
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                className="w-5"
                                type="checkbox"
                                id="furnished"
                                onChange={handleChange}
                                checked={formData.furnished}
                            />
                            <span className="text-primary-500 font-semibold">
                                Furnished
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                className="w-5"
                                type="checkbox"
                                id="offer"
                                onChange={handleChange}
                                checked={formData.offer}
                            />
                            <span className="text-primary-500 font-semibold">
                                Offer
                            </span>
                        </div>
                    </div>

                    {/* Bed / Bath / Prices */}
                    <div className="grid grid-cols-1 gap-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex items-center gap-2">
                                <input
                                    className="border rounded-lg p-3"
                                    type="number"
                                    id="bedrooms"
                                    min="1"
                                    max="10"
                                    required
                                    onChange={handleChange}
                                    value={formData.bedrooms}
                                />
                                <p className="text-primary-500 font-semibold">
                                    Bedrooms
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    className="border rounded-lg p-3"
                                    type="number"
                                    id="bathrooms"
                                    min="1"
                                    max="10"
                                    required
                                    onChange={handleChange}
                                    value={formData.bathrooms}
                                />
                                <p className="text-primary-500 font-semibold">
                                    Bathrooms
                                </p>
                            </div>
                        </div>
                        <div className="grid lg:grid-cols-2 gap-6">
                            <div className="flex items-center gap-2">
                                <input
                                    className="border rounded-lg p-3"
                                    type="number"
                                    id="regularPrice"
                                    min="1500"
                                    required
                                    onChange={handleChange}
                                    value={formData.regularPrice}
                                />
                                <p className="text-primary-500 font-semibold">
                                    Regular Price&nbsp;
                                    <span className="font-light text-secondary-400 text-sm">
                                        ($ / month)
                                    </span>
                                </p>
                            </div>
                            {formData.offer && (
                                <div className="flex items-center gap-2">
                                    <input
                                        className="border rounded-lg p-3"
                                        type="number"
                                        id="discountPrice"
                                        required
                                        onChange={handleChange}
                                        value={formData.discountPrice}
                                    />
                                    <p className="text-primary-500 font-semibold">
                                        Discount Price&nbsp;
                                        <span className="font-light text-secondary-400 text-sm">
                                            ($ / month)
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Image file uploader */}
                    <div className="flex flex-col gap-1">
                        <p className="font-semibold text-primary-500">
                            Images :&nbsp;
                            <span className="font-light text-secondary-400 text-sm">
                                Maximum 6 images (The first image will be the
                                cover). Press 'ADD' once selected
                            </span>
                        </p>
                        <div className="flex gap-4">
                            <label
                                className="flex-1 text-center font-semibold border border-secondary-400 hover:border-effect-300 hover:text-primary-300 rounded-lg uppercase cursor-pointer p-3 text-primary-500 duration-200"
                                htmlFor="images"
                            >
                                Select Image(s){" "}
                                {numOfFiles > 0 ? (
                                    <span className="font-light text-secondary-400 text-sm">
                                        : {numOfFiles} image(s) has been added
                                    </span>
                                ) : null}
                            </label>
                            <input
                                type="file"
                                id="images"
                                accept="image/*"
                                onChange={(e) => setFiles(e.target.files)}
                                multiple
                                hidden
                            />
                            <button
                                className="font-semibold border border-optional-400 hover:border-effect-300 hover:text-primary-300 rounded-lg uppercase cursor-pointer p-3 text-primary-500 duration-200"
                                type="button"
                                onClick={handleImageSubmit}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>

                {/* PREVIEW IMAGES */}
                {formData.imageUrls.length > 0 &&
                    formData.imageUrls.length < 7 && (
                        <div className="grid sm:grid-cols-2 gap-6 mt-4">
                            {formData.imageUrls.map((url, index) => (
                                <div
                                    className="relative w-80 sm:w-60 md:w-80 h-40 rounded-lg overflow-hidden flex justify-self-center"
                                    key={url}
                                >
                                    <img
                                        className="object-cover w-full h-full"
                                        src={url}
                                        alt="Listing Img"
                                    />
                                    <button
                                        className="absolute text-optional-500 hover:text-error duration-200 text-lg bottom-2 right-2 opacity-50 hover:opacity-100"
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        <FaWindowClose />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                <button
                    className="bg-primary-500 text-effect-300 p-3 rounded-lg uppercase hover:bg-effect-300 hover:text-primary-500 duration-200 mt-4"
                    disabled={uploading || loading}
                >
                    {uploading
                        ? "Uploading Image(s)"
                        : loading
                        ? "updating listing"
                        : "Submit update"}
                </button>
            </form>
        </main>
    );
};
export default UpdateListing;
