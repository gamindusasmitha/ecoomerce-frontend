import { BiPlus } from "react-icons/bi"
import { Link } from "react-router-dom"

export default function AdminProductPage(){
    return(
        <div className="w-full h-full flex justify-center items-center text-6xl relative ">
            Product page

            <Link to ="/admin/add-product" 
            className="w-[50px] h-[50px] absolute flex justify-center items-center text-6xl right-[20px] bottom-[20px] hover: accent hover:bg-accent border rounded-full ">
                <BiPlus/>
            </Link>


        </div>
    )
}