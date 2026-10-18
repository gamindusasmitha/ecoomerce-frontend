import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function UserData() {
    const [user, setUser] = useState(null);

    useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);

    if (token != null) {
        axios
            .get(import.meta.env.VITE_BACKEND_URL + "/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                console.log("User:", response.data);
                setUser(response.data);
            })
            .catch((error) => {
                console.log("Error:", error.response?.status, error.response?.data);
            });
    }
}, []);

    return (
        <>
            {user ? (
                <div>
                    <span className="mx-2">Hello, {user.firstName}</span>
                    <button
                        className="mx-2"
                        onClick={() => {
                            localStorage.removeItem("token");
                            window.location.href = "/login";
                        }}
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <div>
                    <Link to="/login" className="mx-2">Login</Link>
                    <Link to="/register" className="mx-2">Register</Link>
                </div>
            )}
        </>
    );
}