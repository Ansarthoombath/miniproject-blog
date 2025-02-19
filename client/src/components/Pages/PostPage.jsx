

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function PostPage() {
  const [postInfo, setPostInfo] = useState(null); 
  const [userInfo, setUserInfo] = useState(null); 
  const { id } = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch post details
    fetch(`http://localhost:4000/post/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch post data');
        }
        return response.json();
      })
      .then((postInfo) => setPostInfo(postInfo))
      .catch((error) => console.error(error));

    // Fetch logged-in user info
    fetch(`http://localhost:4000/profile`, {
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        return response.json();
      })
      .then((userInfo) => setUserInfo(userInfo))
      .catch((error) => console.error(error));
  }, [id]);

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`http://localhost:4000/post/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete post');
        }
        const data = await response.json();
        alert(data.message);
        navigate('/'); // Redirect to homepage
      } catch (err) {
        console.error('Error deleting post:', err);
        alert(err.message);
      }
    }
  };

  if (!postInfo) return <p>Loading...</p>;

  // Check if the logged-in user is the author of the post
  const isAuthor = userInfo && postInfo.author && postInfo.author._id === userInfo.id; 
  console.log(isAuthor);

  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      <div className="image">
        <img
          src={`http://localhost:4000/${postInfo.cover}`}
          alt={postInfo.title}
        />
      </div>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
      {isAuthor && (
        <div>
          <button onClick={handleDeletePost} className="btn btn-danger">
            Delete Post
          </button>
          <Link to={`/edit-post/${id}`} className="btn btn-primary" style={{ marginTop: '15px', padding: '10px 20px', textDecoration:'none',width:'100%'}}>
            Edit Post
          </Link>
        </div>
      )}
    </div>
  );
}

export default PostPage;

