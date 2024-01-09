import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SwiperCore from "swiper";
import { Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

const Home = () => {
    const [offerListings, setOfferListings] = useState([]);
    const [saleListings, setSaleListings] = useState([]);
    const [rentListings, setRentListings] = useState([]);
    SwiperCore.use([Navigation]); // might not need

    useEffect(() => {
        const fetchOfferListings = async () => {
            try {
                const res = await fetch("/api/listing/get?offer=true&limit=3");
                const data = await res.json();
                setOfferListings(data);
                fetchRentListings();
            } catch (error) {
                console.log(error);
            }
        };

        const fetchRentListings = async () => {
            try {
                const res = await fetch("/api/listing/get?type=rent&limit=3");
                const data = await res.json();
                setRentListings(data);
                fetchSaleListings();
            } catch (error) {
                console.log(error);
            }
        };

        const fetchSaleListings = async () => {
            try {
                const res = await fetch("/api/listing/get?type=sale&limit=3");
                const data = await res.json();
                setSaleListings(data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchOfferListings();
    }, []);
    return (
        <div>
            {/* Top */}
            <div className="px-2 pt-16 max-w-6xl m-auto">
                <h1 className="font-bold text-3xl md:text-6xl text-secondary-400">
                    Find your next{" "}
                    <span className="text-primary-500">perfect</span> home,
                    <br /> with ease...
                </h1>
                <div className="mt-4 mb-8">
                    <p className="text-secondary-400 font-light text-sm">
                        Zukkii Estate is the best place to find your truly dream
                        home.
                    </p>
                    <p className="text-secondary-400 font-light text-sm">
                        We have various selections home that will definitely
                        match what you are looking for. In just a few clicks,
                        your next comfy home will be in front of you
                    </p>
                </div>
                <Link
                    className="text-primary-500 font-semibold text-lg hover:text-effect-300 overflow-hidden truncate w-32 sm:w-52"
                    to={"/search"}
                >
                    START HERE...
                </Link>
            </div>

            {/* Swiper */}
            {offerListings && offerListings.length > 0 && (
                <Swiper
                    className="mb-24 mt-8"
                    pagination={{
                        clickable: true,
                    }}
                    loop={true}
                    modules={[Pagination]}
                >
                    {offerListings.map((listing) => (
                        <SwiperSlide key={listing._id}>
                            <div
                                className="h-[360px] w-full bg-slate-100"
                                key={listing._id}
                            >
                                <img
                                    className="object-cover w-full h-[480px]"
                                    src={listing.imageUrls[0]}
                                    alt="cover image"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}

            {/* Listing result for offer, sale and rent */}
            {/* Recent offer */}
            <div className="max-w-6xl mx-auto px-2 flex flex-col gap-8 mt-4 mb-16">
                {offerListings && offerListings.length > 0 && (
                    <div>
                        <div className="mb-4">
                            <h2 className="text-2xl font-semibold text-primary-500">
                                Recent offers
                            </h2>
                            <Link
                                className="font-light text-primary-500 hover:text-secondary-300"
                                to={"/search?offer=true"}
                            >
                                Show more offer
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-8">
                            {offerListings.map((listing) => (
                                <ListingItem
                                    listing={listing}
                                    key={listing._id}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Recent Rect */}
            <div className="max-w-6xl mx-auto px-2 flex flex-col gap-8 mt-4 mb-16">
                {rentListings && rentListings.length > 0 && (
                    <div>
                        <div className="mb-4">
                            <h2 className="text-2xl font-semibold text-primary-500">
                                Recent Added Properties for Rent
                            </h2>
                            <Link
                                className="font-light text-primary-500 hover:text-secondary-300"
                                to={"/search?type=rent"}
                            >
                                Show more properties for rent
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-8">
                            {rentListings.map((listing) => (
                                <ListingItem
                                    listing={listing}
                                    key={listing._id}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Recent Sale */}
            <div className="max-w-6xl mx-auto px-2 flex flex-col gap-8 mt-4 mb-16">
                {saleListings && saleListings.length > 0 && (
                    <div>
                        <div className="mb-4">
                            <h2 className="text-2xl font-semibold text-primary-500">
                                Recent Add Sale properties
                            </h2>
                            <Link
                                className="font-light text-primary-500 hover:text-secondary-300"
                                to={"/search?type=sale"}
                            >
                                Show more sale properties
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-8">
                            {saleListings.map((listing) => (
                                <ListingItem
                                    listing={listing}
                                    key={listing._id}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default Home;
