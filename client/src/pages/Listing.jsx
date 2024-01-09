import { list } from "firebase/storage";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { FaCopy } from "react-icons/fa";
import { useSelector } from "react-redux";

import Contact from "../components/Contact";

const Listing = () => {
    SwiperCore.use([Navigation]);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [contact, setContact] = useState(false);

    const params = useParams();

    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if (data.success === false) {
                    toast.error(data.message);
                    setError(true);
                    setLoading(false);
                    return;
                }
                setListing(data);
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchListing();
    }, [params.listingId]);

    return (
        <main>
            {loading && <p className="text-center my-7 text-2xl">LOADING...</p>}
            {error && (
                <p className="text-center my-7 text-2xl">
                    "Something went wrong..."
                </p>
            )}
            {listing && !loading && !error && (
                <>
                    <Swiper
                        pagination={{
                            clickable: true,
                        }}
                        loop={true}
                        modules={[Pagination]}
                    >
                        {listing.imageUrls.map((url) => (
                            <SwiperSlide key={url}>
                                <div className="h-[360px] w-full bg-slate-100">
                                    <img
                                        src={url}
                                        alt="images"
                                        className="object-cover w-full h-[480px]"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div
                        className="fixed top-[90px] right-[20px] z-10 border rounded-full w-8 h-8 justify-center items-center flex bg-secondary-50 opacity-20 hover:opacity-60 duration-200 cursor-pointer"
                        title="copy link"
                    >
                        <FaCopy
                            className="text-secondary-400"
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    window.location.href
                                );
                                setIsCopied(true);
                                setTimeout(() => {
                                    setIsCopied(false);
                                }, 2000);
                            }}
                        />
                    </div>
                    <div className="flex flex-col w-[90%] m-auto my-4">
                        {/* Name / Address */}
                        <div className="py-2">
                            <h2 className="text-primary-500 text-4xl font-light overflow-hidden truncate">
                                {listing.name}
                            </h2>
                            <p className="text-secondary-400 overflow-hidden truncate">
                                {listing.address}
                            </p>
                        </div>

                        {/* Details */}
                        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-between">
                            <div className="sm:min-w-[200px] sm:max-w-[200px] py-4 px-6 bg-secondary-50 rounded-lg">
                                <p className="font-semibold text-primary-800 text-md pb-2">
                                    Details
                                </p>
                                <p className="text-primary-800 font-light">
                                    <span className="font-semibold text-secondary-400 text-md">
                                        Bedrooms:{" "}
                                    </span>
                                    {listing.bedrooms}
                                </p>
                                <p className="text-primary-800 font-light">
                                    <span className="font-semibold text-secondary-400 text-md">
                                        Bathrooms:{" "}
                                    </span>
                                    {listing.bathrooms}
                                </p>
                                <p className="text-primary-800 font-light">
                                    <span className="font-semibold text-secondary-400 text-md">
                                        Furnished:{" "}
                                    </span>
                                    {listing.furnished ? "yes" : "no"}
                                </p>
                                <p className="text-primary-800 font-light">
                                    <span className="font-semibold text-secondary-400 text-md">
                                        Parking lot:{" "}
                                    </span>
                                    {listing.parking ? "yes" : "no"}
                                </p>
                                <p className="text-primary-800 font-light">
                                    <span className="font-semibold text-secondary-400 text-md">
                                        Sale/Rent:{" "}
                                    </span>
                                    {listing.type === "sale"
                                        ? "for sale"
                                        : "for rent"}
                                </p>
                                <p className="text-primary-800 font-light">
                                    <span className="font-semibold text-secondary-400 text-md">
                                        Rate:&nbsp;
                                    </span>
                                    ${listing.regularPrice} / m
                                </p>
                                {listing.offer ? (
                                    <>
                                        <br />
                                        <p className="font-semibold text-secondary-500">
                                            Special Deal
                                        </p>
                                        <p className="font-semibold text-secondary-500">
                                            $
                                            {listing.regularPrice -
                                                listing.discountPrice}
                                            &nbsp;Discount
                                        </p>
                                        <p className="font-semibold text-secondary-500">
                                            <span className="text-optional-500 font-bold">
                                                Now:&nbsp;
                                            </span>
                                            ${listing.discountPrice} / m
                                        </p>
                                    </>
                                ) : null}
                            </div>

                            {/* Description */}
                            <div className="w-full px-6 py-4 bg-optional-100 rounded-lg sm:max-w-[80%] lg:max-w-[95%]">
                                <p className="font-semibold text-primary-800 pb-2 text-md">
                                    Description
                                </p>
                                <p className="text-primary-800 font-light">
                                    {listing.description}
                                </p>
                            </div>
                        </div>

                        {currentUser &&
                            listing.userRef !== currentUser._id &&
                            !contact && (
                                <button
                                    className="bg-primary-500 text-effect-300 p-3 rounded-lg uppercase hover:bg-effect-300 hover:text-primary-500 duration-200 mt-4"
                                    onClick={() => {
                                        setContact(true);
                                    }}
                                >
                                    Contact Landlord
                                </button>
                            )}
                        {contact && <Contact listing={listing} />}
                    </div>
                </>
            )}
        </main>
    );
};
export default Listing;
