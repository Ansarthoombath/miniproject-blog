import React, { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom';

function Registerpage() {

  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [redirect,setRedirect]=useState(false)

  
  async function register(ev) {
    ev.preventDefault();
    // console.log({ username, password }); 
  
    const response = await fetch('http://localhost:4000/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    // console.log(response)
    // console.log("Response Status:", response.status); 
    if (response.status === 200) {
      alert('Registration success');
      
        setUserInfo(userInfo)
        setRedirect(true)
      
    } else {
      alert('Failed');
    }
  }
  if(redirect){
    return <Navigate to={'/'}/>
   }
  

  return (
    <div>
      <form className='register' onSubmit={register}>
        <h1>Register</h1>
        <input type="text"
         placeholder='username'
         value={username}
         onChange={ev => setUsername(ev.target.value)}/>
        <input type="password"
         placeholder='password'
         value={password}
         onChange={ev=>setPassword(ev.target.value)}/>
        <button>Register</button>
      </form>
    </div>
  )
}

export default Registerpage
