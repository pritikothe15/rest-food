import React,{useState,useEffect} from "react";
import { currentUser } from "../../util/currentUser";
import axios from "axios";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(()=>{
      if(currentUser){
        window.location.href='/'
      }
  },[])

 async function loginUser(){
    const response = await axios.post('/login',{
        email:email,
        password:password,
    })
         console.log(response.data)
         if(response.data.success){
          alert(response.data.message)
          localStorage.setItem('currentUser',JSON.stringify(response.data.data));
          window.location.href="/"

         }
         else{
          alert('Error :'+  response.data.message)
          setEmail('')
          setPassword('')
          localStorage.removeItem('currentUser');
         }
        
 } 

  return (
    <div>
      <h1 className="text-center">Login</h1>
      <div className="row">
            <div className="col-md-6"></div>
        <div className="col-md-6">
            <div className="form-container">
                 <form>

                    <div>
                        <label htmlFor="email" >Email:</label>
                        <input type="email" id="email" placeholder="Enter Email" className="user-input"
                        value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>

                    <div>
                        <label htmlFor="password" >Password:</label>
                        <input type="password" id="password" placeholder="Enter Password"  className="user-input"
                         value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>

                    <div>
                        <button type="button" className="login-button" onClick={loginUser} >
                        Login
                        </button>
                    </div>   
                    
                 </form>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Login;
