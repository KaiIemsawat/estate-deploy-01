import { errorHandle } from "../middleware/errorHandle.js";
import Listing from "../models/listing.model.js";

export const createListing = async (req, res, next) => {
    const { name } = req.body;
    // console.log("INPUT NAME ---- ", name);

    const isNameUsed = await Listing.findOne({ name });
    if (isNameUsed) {
        return next(errorHandle(400, "Listing name has been used"));
    }
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
};

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(errorHandle(404, "Listing not found"));
    }

    if (req.user.userId !== listing.userRef) {
        return next(errorHandle(401, "You may only delete your own listings"));
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json("Listing has been deleted!");
    } catch (error) {
        next(error);
    }
};

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(errorHandle(404, "Listing not found..!"));
    }
    if (req.user.userId !== listing.userRef) {
        return next(errorHandle(401, "You may only edit your own listings..!"));
    }

    try {
        const updated_Listing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (req.body.discountPrice > req.body.regularPrice) {
            return next(
                errorHandle(422, "Discount Price can't exceed Regular Price")
            );
        }
        res.status(200).json(updated_Listing);
    } catch (error) {
        next(error);
    }
};

export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandle(404, "Listing not found"));
        }
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
};

// Get all listing and logics for search function
export const gatAllListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        let offer = req.query.offer;
        if (offer === undefined || offer === "false") {
            offer = { $in: [false, true] };
        }

        let furnished = req.query.furnished;
        if (furnished === undefined || furnished === "false") {
            furnished = { $in: [false, true] };
        }

        let parking = req.query.parking;
        if (parking === undefined || parking === "false") {
            parking = { $in: [false, true] };
        }

        let type = req.query.type;
        if (type === undefined || type === "all") {
            type = { $in: ["sale", "rent"] };
        }

        const searchTerm = req.query.searchTerm || "";

        const sort = req.query.sort || "createdAt";

        const order = req.query.order || "desc";

        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: "i" },
            // $regex: searchTerm -> mongo search function term. $options : "i" -> ignore case
            offer,
            furnished,
            parking,
            type,
        })
            .sort({ [sort]: order })
            .limit(limit)
            .skip(startIndex);

        return res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
};
