import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState("");

    const onChange = (e) => {
        setMessage(e.target.value);
    };

    useEffect(() => {
        const fetchLandLord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                setLandlord(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchLandLord();
    }, [listing.userRef]);
    return (
        <>
            {landlord && (
                <div className="my-6 flex flex-col">
                    <p className="text-primary-500 overflow-hidden truncate">
                        Contact{" "}
                        <span className="font-semibold">
                            {landlord.username}
                        </span>{" "}
                        for{" "}
                        <span className="font-semibold">{listing.name}</span>
                    </p>
                    <textarea
                        className="rounded-lg bg-[#f8f8f8] mt-2 mb-4 w-full p-4"
                        name="message"
                        id="message"
                        value={message}
                        onChange={onChange}
                        placeholder="Enter your message here"
                    ></textarea>
                    <Link
                        className="text-center bg-optional-400 text-primary-500 p-3 rounded-lg uppercase hover:bg-effect-300 hover:text-primary-500 duration-200"
                        to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
                    >
                        Send message
                    </Link>
                </div>
            )}
        </>
    );
};
export default Contact;
