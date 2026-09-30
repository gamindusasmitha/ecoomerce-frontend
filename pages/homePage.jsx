import { Route, Routes } from "react-router-dom"
import Header from "../components/header"

export default function HomePage(){
    return(
        <div className="w-full h-full">
            <Header/>

            <div className="w-full min-h-[calc(100%-100px)] ">

                <Routes>
                    <Route path='/' element = {<h1>Home Page</h1>}></Route>
                    <Route path='/products' element = {<h1>Products Page</h1>}></Route>
                    <Route path='/about' element = {<h1>About Us Page</h1>}></Route>
                    <Route path='/contacts' element = {<h1>Contacts Page</h1>}></Route>
                    <Route path='/*' element= {<h1>Page not found</h1>}></Route>

                </Routes>



            </div>


        </div>
    )
}