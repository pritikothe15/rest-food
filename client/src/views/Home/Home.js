import React,{useState,useEffect} from 'react'
import "./Home.css"
import axios from 'axios';
import FoodItemCard from "./../../components/FoodItemCard/FoodItemCard" 
import Navbar from "./../../components/Navbar/Navbar"

import { currentUser } from "../../util/currentUser";
import { loginRequired } from '../../util/loginRequired';

function Home() {

  const[searchText,setSearchText]= useState('')
  const[currentFoodItems,setAllFoodItems]= useState([])


  async function fetchAllItems(){
    console.log('fetching all items')
    const response= await axios.get("/allFoodItems")
    console.log(response.data.data)
    setAllFoodItems(response.data.data)
  }

  async function fetchSpecificItems(){
    console.log("fetching specific items")
    const response= await axios.get(`/foodItems?title=${searchText}`)
    console.log(response.data.data)
    setAllFoodItems(response.data.data)
 
  }

  useEffect(()=>{
    if(searchText.length>0){
      fetchSpecificItems()
    }
    else{
      fetchAllItems()
    }
  },[searchText])

  function logOut(){
    localStorage.removeItem('currentUser');
    window.location.href='/login'
  }

  useEffect(()=>{   
       loginRequired()
  },[])
  
  return (
    <div>
       <Navbar user={currentUser?.name} />
         
      <div className="search-container"> 
      <input type="text" placeholder="Search" className='input-search '
      value={searchText}
      onChange={(e)=>setSearchText(e.target.value)}/>
      </div>   

      <div className='food-items-result'>
        <div class="row">
        {
          currentFoodItems?.map((foodItem,index)=>{
            return(<FoodItemCard description={foodItem.description} category={foodItem.category} title={foodItem.title} price={foodItem.price} imgUrl={foodItem.imgUrl}  key={index}/>)
          })
        }
        </div> 
      </div>

      <button type ="button " className='btn btn-primary' onClick={logOut}> Logout </button>
    </div>
  )
}

export default Home