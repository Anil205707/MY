const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ MONGODB CONNECTION ============
mongoose.connect('mongodb://localhost:27017/portfolio')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err.message));

// ============ SCHEMAS ============
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, default: 'admin' }
});

const profileSchema = new mongoose.Schema({
  fullName: { type: String, default: 'Anil Singh' },
  title: { type: String, default: 'Computer Science Graduate | Full-Stack Developer' },
  bio: { type: String, default: 'Results-driven Computer Science graduate with hands-on experience in software engineering.' },
  email: { type: String, default: 'anil20570729@gmail.com' },
  phone: { type: String, default: '+44 7311306180' },
  location: { type: String, default: 'Wolverhampton, United Kingdom' },
  resumeUrl: { type: String, default: '' },
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' }
  }
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  techStack: [String],
  liveUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, default: '' },
  message: { type: String, required: true },
  read: { type: Boolean, default: false }
}, { timestamps: true });

// Hash password middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
const Profile = mongoose.model('Profile', profileSchema);
const Project = mongoose.model('Project', projectSchema);
const Message = mongoose.model('Message', messageSchema);

// ============ AUTH MIDDLEWARE ============
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, 'secret123');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// ============ CV UPLOAD SETUP ============
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Uploads folder created at:', uploadDir);
} else {
  console.log('✅ Uploads folder exists at:', uploadDir);
}

// Configure multer with error handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `current-cv${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.pdf' || ext === '.docx') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'), false);
    }
  }
});

// Serve static files
app.use('/uploads', express.static(uploadDir));

// ============ PUBLIC ROUTES ============
app.get('/', (req, res) => {
  res.json({ message: 'Server is running! Welcome to Portfolio API' });
});

app.get('/api/public/profile', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) profile = await Profile.create({});
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/public/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort('-createdAt');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/public/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    await Message.create({ name, email, subject, message });
    res.status(201).json({ success: true, message: 'Message sent!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/public/download-cv', async (req, res) => {
  try {
    const pdfPath = path.join(uploadDir, 'current-cv.pdf');
    const docxPath = path.join(uploadDir, 'current-cv.docx');
    
    if (fs.existsSync(pdfPath)) {
      res.download(pdfPath, 'Anil_Singh_CV.pdf');
    } else if (fs.existsSync(docxPath)) {
      res.download(docxPath, 'Anil_Singh_CV.docx');
    } else {
      res.status(404).json({ message: 'CV not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ AUTH ROUTES ============
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user._id, username: user.username }, 'secret123', { expiresIn: '30d' });
    res.json({ success: true, token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ ADMIN ROUTES ============
app.get('/api/admin/profile', authMiddleware, async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) profile = await Profile.create({});
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/profile', authMiddleware, async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (profile) {
      profile = await Profile.findOneAndUpdate({}, req.body, { new: true });
    } else {
      profile = await Profile.create(req.body);
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/projects', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find().sort('-createdAt');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/projects', authMiddleware, async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/projects/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/projects/:id', authMiddleware, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/messages', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find().sort('-createdAt');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/messages/:id', authMiddleware, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ CV ROUTES ============
app.post('/api/admin/upload-cv', authMiddleware, (req, res) => {
  upload.single('cv')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded. Please select a PDF or DOCX file.' 
      });
    }
    
    console.log('✅ CV uploaded successfully:', req.file.filename);
    console.log('📁 File path:', req.file.path);
    console.log('📏 File size:', req.file.size, 'bytes');
    
    res.json({ 
      success: true, 
      message: 'CV uploaded successfully! Visitors can now download your CV from the homepage.',
      file: {
        name: req.file.filename,
        size: req.file.size,
        path: `/uploads/${req.file.filename}`
      }
    });
  });
});

app.get('/api/admin/cv-info', authMiddleware, (req, res) => {
  try {
    const pdfPath = path.join(uploadDir, 'current-cv.pdf');
    const docxPath = path.join(uploadDir, 'current-cv.docx');
    const hasCV = fs.existsSync(pdfPath) || fs.existsSync(docxPath);
    
    let fileType = null;
    if (fs.existsSync(pdfPath)) fileType = 'pdf';
    else if (fs.existsSync(docxPath)) fileType = 'docx';
    
    res.json({ 
      hasCV, 
      fileType,
      message: hasCV ? 'CV is available for download' : 'No CV uploaded yet'
    });
  } catch (error) {
    console.error('Error checking CV:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ CREATE DEFAULT ADMIN ============
async function createDefaultAdmin() {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        password: 'admin123',
        email: 'admin@portfolio.com',
        role: 'admin'
      });
      console.log('✅ Admin created: admin / admin123');
    } else {
      console.log('✅ Admin already exists');
    }
  } catch (error) {
    console.error('Error creating admin:', error);
  }
}

// ============ ERROR HANDLING ============
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: err.message 
  });
});

// ============ START SERVER ============
const PORT = 5000;
app.listen(PORT, async () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`📁 Uploads directory: ${uploadDir}`);
  await createDefaultAdmin();
});