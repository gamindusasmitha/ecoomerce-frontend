import logo from "../public/logo.png";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="w-full h-2/12 bg-accent flex items-center">

            <img 
                src={logo} 
                alt="Logo" 
                className="h-full w-auto"
            />

            <div className="flex-1 h-full text-2xl text-primary justify-center items-center flex gap-[20px]">
                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
            </div>

        </header>
    )
}