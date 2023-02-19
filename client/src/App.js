import React from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import BookTable from './views/BookTable/BookTable'

import Home from "./views/Home/Home"
import Login from "./views/Login/Login"
import MyList from './views/MyList/MyList'
import MyOrders from './views/MyOrders/MyOrders'
import Profile from './views/Profile/Profile'
import Signup from "./views/Signup/Signup"

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element ={<Home />}/>
        <Route  path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/bookTable" element={<BookTable/>}/>
        <Route path="/myList" element={<MyList/>}/>
        <Route path="/myOrders" element={<MyOrders/>}/>
        <Route path="/Profile" element={<Profile/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App