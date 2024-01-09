import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, minlength: 6 },
        avatar: {
            type: String,
            default:
                "https://img.freepik.com/free-psd/3d-icon-social-media-app_23-2150049569.jpg?w=1380&t=st=1704132029~exp=1704132629~hmac=6d7d3ee24ee3810824f8abb937f60a02809a3692a2721c20746e7d966de9be8d",
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
