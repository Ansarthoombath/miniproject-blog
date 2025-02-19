import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function EditPost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const { id } = useParams(); // Post ID from URL

  useEffect(() => {
    // Fetch the existing post data
    fetch(`http://localhost:4000/post/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch post data');
        }
        return response.json();
      })
      .then((postInfo) => {
        setTitle(postInfo.title);
        setSummary(postInfo.summary);
        setContent(postInfo.content);
      })
      .catch((error) => console.error(error));
  }, [id]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'list',
    'bullet',
    'link',
    'image',
  ];

  const updatePost = async (event) => {
    event.preventDefault();

    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    if (files && files[0]) {
      data.set('file', files[0]); // Include file only if a new one is selected
    }

    const response = await fetch(`http://localhost:4000/post/${id}`, {
      method: 'PUT',
      body: data,
      credentials: 'include',
    });

    if (response.ok) {
      setRedirect(true); // Redirect after successful update
    } else {
      const errorData = await response.json();
      alert(errorData.error || 'Failed to update post');
    }
  };

  if (redirect) {
    return <Navigate to={`/post/${id}`} />; // Redirect to the updated post
  }

  return (
    <form onSubmit={updatePost}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
        style={{ marginBottom: '10px', width: '100%', padding: '8px' }}
      />
      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
        style={{ marginBottom: '10px', width: '100%', padding: '8px' }}
      />
      <input
        type="file"
        onChange={(ev) => setFiles(ev.target.files)}
        style={{ marginBottom: '10px' }}
      />
      <ReactQuill
        value={content}
        onChange={(newValue) => setContent(newValue)}
        modules={modules}
        formats={formats}
      />
      <button style={{ marginTop: '15px', padding: '10px 20px' }}>
        Update Post
      </button>
    </form>
  );
}

export default EditPost;
