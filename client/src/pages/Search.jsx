import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

const Search = () => {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: "",
        type: "all",
        parking: false,
        furnished: false,
        offer: false,
        sort: "created_at",
        order: "desc",
    });
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);

    const navigate = useNavigate();

    // dynamicly change data in fields and url
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);

        const searchTermFromUrl = urlParams.get("searchTerm");
        const typeFromUrl = urlParams.get("type");
        const parkingFromUrl = urlParams.get("parking");
        const furnishedFromUrl = urlParams.get("furnished");
        const offerFromUrl = urlParams.get("offer");
        const sortFromUrl = urlParams.get("sort");
        const orderFromUrl = urlParams.get("order");

        if (
            searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ) {
            setSidebarData({
                searchTerm: searchTermFromUrl || "",
                type: typeFromUrl || "all",
                parking: parkingFromUrl === "true" ? true : false,
                furnished: furnishedFromUrl === "true" ? true : false,
                offer: offerFromUrl === "true" ? true : false,
                sort: sortFromUrl || "created_at",
                order: orderFromUrl || "desc",
            });
        }

        const fetchListings = async () => {
            setLoading(true);
            setShowMore(false);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();

            if (data.length > 8) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
            setListings(data);
            setLoading(false);
        };

        fetchListings();
    }, [location.search]);

    const handleChange = (e) => {
        // Set value to one of 'all' or 'rent' or 'sale'
        if (
            e.target.id === "all" ||
            e.target.id === "rent" ||
            e.target.id === "sale"
        ) {
            setSidebarData({ ...sidebarData, type: e.target.id });
        }

        // set value for 'search'
        if (e.target.id === "searchTerm") {
            setSidebarData({ ...sidebarData, searchTerm: e.target.value });
        }

        if (
            e.target.id === "parking" ||
            e.target.id === "furnished" ||
            e.target.id === "offer"
        ) {
            setSidebarData({
                ...sidebarData,
                [e.target.id]:
                    e.target.checked || e.target.checked === "true"
                        ? true
                        : false,
            });
        }

        if (e.target.id === "sort_order") {
            const sort = e.target.value.split("_")[0] || "created_at";

            const order = e.target.value.split("_")[1] || "desc";

            setSidebarData({ ...sidebarData, sort, order });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // create query params string
        const urlParams = new URLSearchParams();
        urlParams.set("searchTerm", sidebarData.searchTerm);
        urlParams.set("type", sidebarData.type);
        urlParams.set("parking", sidebarData.parking);
        urlParams.set("furnished", sidebarData.furnished);
        urlParams.set("offer", sidebarData.offer);
        urlParams.set("sort", sidebarData.sort);
        urlParams.set("order", sidebarData.order);
        const searchQuery = urlParams.toString();

        navigate(`/search?${searchQuery}`);
    };

    const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("startIndex", startIndex);
        const searchQuery = urlParams.toString();

        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();

        if (data.length < 9) {
            setShowMore(false);
        }
        setListings([...listings, ...data]);
    };

    return (
        <div className="flex flex-col md:flex-row">
            {/* Left section */}
            <div className=" p-7 border-b-2 md:border-b-0 md:border-r-2 md:min-h-screen md:max-w-[340px] md:min-w-[340px]">
                <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <label className="whitespace-nowrap font-semibold text-primary-500">
                            Search Term:
                        </label>
                        <input
                            className="border rounded-lg p-3 w-full"
                            type="text"
                            id="searchTerm"
                            placeholder="Search..."
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Types */}
                    <div className="flex flex-col gap-2">
                        <label className=" font-semibold text-primary-500">
                            Type:
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                            <div className="flex gap-2 items-center">
                                <input
                                    className="w-5"
                                    type="checkbox"
                                    id="all"
                                    checked={sidebarData.type === "all"}
                                    onChange={handleChange}
                                />
                                <span className="text-secondary-700">
                                    Rent&nbsp;&&nbsp;Sale
                                </span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <input
                                    className="w-5"
                                    type="checkbox"
                                    id="rent"
                                    checked={sidebarData.type === "rent"}
                                    onChange={handleChange}
                                />
                                <span className="text-secondary-700">Rent</span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <input
                                    className="w-5"
                                    type="checkbox"
                                    id="sale"
                                    checked={sidebarData.type === "sale"}
                                    onChange={handleChange}
                                />
                                <span className="text-secondary-700">Sale</span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <input
                                    className="w-5"
                                    type="checkbox"
                                    id="offer"
                                    checked={sidebarData.offer}
                                    onChange={handleChange}
                                />
                                <span className="text-secondary-700">
                                    Offer
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-col gap-2">
                        <label className=" font-semibold text-primary-500">
                            Amenities:
                        </label>
                        <div className="grid grid-cols-2 gap-x-4">
                            <div className="flex gap-2 items-center">
                                <input
                                    className="w-5"
                                    type="checkbox"
                                    id="parking"
                                    checked={sidebarData.parking}
                                    onChange={handleChange}
                                />
                                <span className="text-secondary-700">
                                    Parking&nbsp;Lot
                                </span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <input
                                    className="w-5"
                                    type="checkbox"
                                    id="furnished"
                                    checked={sidebarData.furnished}
                                    onChange={handleChange}
                                />
                                <span className="text-secondary-700">
                                    Furnished
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Sort */}
                    <div className="flex flex-col gap-2">
                        <label className=" font-semibold text-primary-500">
                            Sort:
                        </label>
                        <select
                            className="border rounded-lg p-3 w-full"
                            id="sort_order"
                            onChange={handleChange}
                            defaultValue={"created_at_desc"}
                        >
                            <option value="regularPrice_desc">
                                Price : High to Low
                            </option>
                            <option value="regularPrice_asc">
                                Price : Low to High
                            </option>
                            <option value="createdAt_desc">
                                Lastest First
                            </option>
                            <option value="createdAt_asc">Oldest First</option>
                        </select>
                    </div>
                    <button className="bg-primary-500 text-effect-300 p-3 rounded-lg uppercase hover:bg-effect-300 hover:text-primary-500 duration-200">
                        Search
                    </button>
                </form>
            </div>

            {/* Right section */}
            <div className="p-7">
                <div>
                    <h2 className="text-3xl font-semibold text-primary-500">
                        Listings:
                    </h2>
                    <div className="py-2 flex flex-wrap gap-3">
                        {!loading && listings.length === 0 && (
                            <p className="text-xl text-optional-500 font-light">
                                No listing found...
                            </p>
                        )}
                        {loading && (
                            <p className="text-xl text-optional-500 font-light">
                                Loading...
                            </p>
                        )}
                        {!loading &&
                            listings &&
                            listings.map((listing) => (
                                <ListingItem
                                    key={listing._id}
                                    listing={listing}
                                />
                            ))}
                    </div>
                </div>
                {showMore && (
                    <button
                        className="border border-optional-400 text-optional-500 px-3 py-2 rounded-md uppercase hover:bg-optional-400  hover:text-effect-300 duration-200 w-[240px] text-center mx-auto my-4"
                        onClick={onShowMoreClick}
                    >
                        Show More
                    </button>
                )}
            </div>
        </div>
    );
};
export default Search;
