
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');
const User = require('./models/User'); 
const Post= require('./models/Post')


const app = express(); 
const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET || 'ascdsjd78sdd'; // Use env variable for secret

// Middleware
app.use(cors({
  credentials: true,
  origin: [
    'http://localhost:5173',
    'https://miniproject-blog-kappa.vercel.app'
  ]
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(__dirname + '/uploads'))

// MongoDB Connection
mongoose.connect('mongodb+srv://mohamedansart:Ansar%40123@cluster0.85c3l.mongodb.net/miniproject?retryWrites=true&w=majority&appName=Cluster0');

// mongodb://localhost:27017/blog

// Routes
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(400).json({ error: 'Registration failed', details: e.message });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res.status(400).json({ error: 'User not found' });
    }
    const passok = bcrypt.compareSync(password, userDoc.password);
    if (passok) {
      //logged in
      jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
        if (err) throw err;
        res
          .cookie('token', token, { httpOnly: true })
          .json({ id:userDoc._id, 
                   username
           });
      });
    } else {
      res.status(400).json({ error: 'Wrong credentials' });
    }
  } catch (e) {
    res.status(500).json({ error: 'Login failed', details: e.message });
  }
});

app.get('/profile', (req,res) => {
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, (err,info) => {
    if (err) throw err;
    res.json(info);
  });
});


app.post('/logout',(req,res)=>{
  res.cookie('token','').json('OK')
})

app.post('/post', uploadMiddleware.single('file'), async (req,res) => {
  const {originalname,path} = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path+'.'+ext;
  fs.renameSync(path, newPath);

  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) throw err;
    const {title,summary,content} = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover:newPath,
      author:info.id,
    });
    res.json(postDoc);
  });

});



  
app.get('/post',async (req,res)=>{
  res.json(
    await Post.find()
    .populate('author',['username'])
     .sort({createdAt:-1})
    .limit(20));
})

app.get('/post/:id', async (req, res) => {
  const {id} = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
})

app.put('/post/:id', uploadMiddleware.single('file'), async (req, res) => {
  const { id } = req.params;
  const { title, summary, content } = req.body;
  let cover = null;

  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
    cover = newPath; // Update cover only if a new file is uploaded
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, summary, content, ...(cover && { cover }) },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(updatedPost);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update post', details: e.message });
  }
});


app.delete('/post/:id', async (req, res) => {
  const { id } = req.params; // Get the post ID from the URL

  try {
    // Find the post to delete
    const postDoc = await Post.findById(id);
    if (!postDoc) return res.status(404).json({ error: 'Post not found' });

    // Delete the post
    await Post.findByIdAndDelete(id);

    // Optionally delete the uploaded file
    if (postDoc.cover) {
      fs.unlink(postDoc.cover, (err) => {
        if (err) console.error('Failed to delete file:', err);
      });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Server error', details: e.message });
  }
});



// Start the Server
app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
