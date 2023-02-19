import React,{useEffect} from 'react'
import "./MyOrders.css"

import { loginRequired } from '../../util/loginRequired';

function MyOrders() {

    useEffect(()=>{
       loginRequired()
      },[])

  return (
    <div>
        <h1>My Orders</h1>
     </div>
  )
}

export default MyOrders