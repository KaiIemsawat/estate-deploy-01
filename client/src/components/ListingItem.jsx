import { Link } from "react-router-dom";

const ListingItem = ({ listing }) => {
    return (
        <div className="bg-white  rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition duration-200 w-full md:w-[340px] overflow-hidden">
            <Link
                className="flex flex-col gap-2"
                to={`/listing/${listing._id}`}
            >
                <img
                    className="h-[240px] md:h-[180px] w-full object-cover rounded-t-lg hover:scale-105  duration-200"
                    src={listing.imageUrls[0]}
                    alt="listing cover image"
                />
                <div className="flex flex-col p-3 pb-4">
                    <p className="text-primary-500 text-lg font-bold overflow-hidden truncate">
                        {listing.name}
                    </p>
                    <p className="text-secondary-400 font-light text-sm overflow-hidden truncate">
                        <span className="text-secondary-400 font-semibold">
                            Location&nbsp;:&nbsp;
                        </span>
                        {listing.address}
                    </p>
                    <p className="text-secondary-400 font-light text-sm">
                        {listing.bedrooms}&nbsp;
                        <span className="text-secondary-400 font-semibold">
                            {listing.bedrooms > 1 ? "bedrooms" : "bedroom"}
                        </span>
                    </p>
                    <p className="text-secondary-400 font-light text-sm">
                        {listing.bathrooms}&nbsp;
                        <span className="text-secondary-400 font-semibold">
                            {listing.bathrooms > 1 ? "bathrooms" : "bathroom"}
                        </span>
                    </p>
                    <p className="text-secondary-400 font-light text-sm">
                        ${listing.regularPrice}&nbsp;
                        <span className="text-secondary-400 font-semibold">
                            : month
                        </span>
                    </p>
                    <p className="text-secondary-400 font-light text-sm line-clamp-1 my-2">
                        <span className="text-secondary-400 font-semibold">
                            Description :&nbsp;
                        </span>
                        {listing.description}
                    </p>
                    <div className="w-[80%] border-t-2 m-auto my-2"></div>
                    {listing.offer ? (
                        <div className="">
                            <p className="font-semibold text-secondary-500">
                                Special Deal
                            </p>
                            <p className="font-semibold text-secondary-500">
                                ${listing.regularPrice - listing.discountPrice}
                                &nbsp;Discount
                            </p>
                            <p className="font-semibold text-secondary-500 text-lg">
                                <span className="text-optional-500 font-bold">
                                    Now:&nbsp;
                                </span>
                                ${listing.discountPrice} / m
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p className="font-semibold text-secondary-500">
                                No deal at the moment
                            </p>
                            <p className="text-secondary-400 font-light text-sm">
                                Keep checking
                            </p>
                            <p className="text-secondary-400 font-light text-sm">
                                Deals may available anytime...
                            </p>
                        </div>
                    )}
                </div>
            </Link>
        </div>
    );
};
export default ListingItem;
