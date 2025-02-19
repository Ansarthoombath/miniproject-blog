import React, { useContext, useEffect, useState } from 'react'

import { Link } from 'react-router-dom'
import { UserContext } from '../UserContext'

function Header() {
  const {setUserInfo,userInfo}=useContext(UserContext)
  useEffect(() => {
    fetch('http://localhost:4000/profile',{
      credentials:'include'
    }).then(response => {
      response.json().then(userInfo =>{
         setUserInfo(userInfo) 
      })
    })
  },[])

  function logout(){
    fetch('http://localhost:4000/logout',{
      credentials:'include',
      method:'POST'
    })
    setUserInfo(null)
  }
   
  const username =userInfo?.username;

  return (
    <main>
      <header>
        <Link className="logo" to="/">MyBlog</Link>
      <nav>
         {
          username && (
            <>
            <Link to="/create">Create new post</Link>
            <a onClick={logout}>Logout</a>
            </>
          )
         }
         {!username && (
          <>
             <Link class="nav-link" to="/login">Login</Link>
             <Link class="nav-link" to="/register">Register</Link>
          </>
         )}

        
     </nav>
        
      
</header>
    </main>
  )
}

export default Header
