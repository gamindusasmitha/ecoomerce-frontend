import { useState } from 'react'


import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from '../pages/registerPage'
import LoginPage from '../pages/loginPage'
import AdminPage from '../pages/adminPage'
import RegisterPage from '../pages/registerPage'
import Header from '../components/header'

function App() {
  

  return (
    
      <BrowserRouter>

      <div className='w-full h-screen bg-primary text-secondary'><Header/>

        <Routes path="/"> <Route path='/' element={<HomePage/>}>

        </Route><Route path='/login' element={<LoginPage/>}>

        </Route><Route path='/register' element={<RegisterPage/>}>

        </Route><Route path='/admin' element={<AdminPage/>}>

        </Route>


        </Routes>


      </div>

      
      </BrowserRouter>

    
  )
}

export default App
