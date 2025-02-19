import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Navigate } from 'react-router-dom';


function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);

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

  const createNewPost = async (event) => {
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', files[0]);

    event.preventDefault();
    console.log({ title, summary, content });
    const response=await fetch('http://localhost:4000/post', {
        method: 'POST',
        body: data,
        credentials: 'include',})
        if (response.ok) {
          setRedirect(true);
        }

  };
  if (redirect) {
    return <Navigate to={'/'} />
  }

  return (
    <form onSubmit={createNewPost}>
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
      <input type="file"
          onChange={ev=>setFiles(ev.target.files)}
          style={{ marginBottom: '10px' }} />
      <ReactQuill
        value={content}
        onChange={(newValue) => setContent(newValue)}
        modules={modules}
        formats={formats}
      />
      <button style={{ marginTop: '15px', padding: '10px 20px' }}>
        Create Post
      </button>
    </form>
  );
}

export default CreatePost;



