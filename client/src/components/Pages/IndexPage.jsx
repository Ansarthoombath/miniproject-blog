import React, { useEffect, useState } from 'react'
import Card from '../Card/Card'

function IndexPage() {
  const [posts,setPosts] = useState([]);
  useEffect(() => {
    fetch('http://localhost:4000/post').then(response => {
      response.json().then(posts => {
        setPosts(posts);
      });
    });
  }, []);
  return (
    <div>
      {posts.length > 0 && posts.map(post => (
        <Card {...post} />
      ))}
    </div>
  )
}

export default IndexPage
