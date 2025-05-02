import React,{useState} from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import {auth} from '../firebase/firebase'

const Signup=({ToggleSignUpLoginHandler})=>{
    const [email,setEmail]=useState("")
    const[password,setPassword]=useState('')

    const handleSignup=async(event)=>{
        event.preventDefault()
        try{
            await createUserWithEmailAndPassword(auth,email,password);
            alert('User Created')
            
        }
        catch(error){
            alert(error.message)
        }
        
        }

    return(
        <div className="login-container">
          <h2>Sign Up</h2>
          <form onSubmit={handleSignup} className="login-form">
            <input 
              type='email' 
              placeholder='Email' 
              onChange={e=>setEmail(e.target.value)} 
              className="login-input"
            />
            <input 
              type="password" 
              placeholder='Password' 
              onChange={e=>setPassword(e.target.value)} 
              className="login-input"
            />
            <button type='submit' className="login-button">Sign Up</button>
          </form>
          <button onClick={ToggleSignUpLoginHandler} className="switch-button">Go to Login</button>
        </div>
    )

}

export default Signup