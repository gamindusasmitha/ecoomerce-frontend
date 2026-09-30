import { useState } from 'react'


import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from '../pages/homePage'
import LoginPage from '../pages/loginPage'
import RegisterPage from '../pages/registerPage'
import AdminPage from '../pages/adminPage'

import Header from '../components/header'

function App() {
  

  return (
    
      <BrowserRouter>

      <div className='w-full h-screen bg-primary text-secondary'>

          <Routes>
                    <Route path='/*' element = {<HomePage/>}></Route>
                    <Route path='/login' element = {<LoginPage/>}></Route>
                    <Route path='/register' element = {<RegisterPage/>}></Route>
                    <Route path='/admin/*' element = {<AdminPage/>}></Route>

                </Routes>

       


      </div>

      
      </BrowserRouter>

    
  )
}

export default App


 