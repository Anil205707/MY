const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Disable SSL certificate validation (fix for self-signed certificate error)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running! Welcome to Portfolio API' });
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected to portfolio database'))
  .catch(err => console.error('❌ MongoDB Error:', err.message));

// ============ SCHEMAS ============
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, default: 'admin' }
}, { timestamps: true });

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
}, { timestamps: true });

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
  read: { type: Boolean, default: false },
  replied: { type: Boolean, default: false }
}, { timestamps: true });

// Hash password middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
const Profile = mongoose.model('Profile', profileSchema);
const Project = mongoose.model('Project', projectSchema);
const Message = mongoose.model('Message', messageSchema);

// ============ AUTH MIDDLEWARE ============
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, 'secret123');
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ============ EMAIL NOTIFICATION SETUP (BREVO) ============

// Create email transporter with Brevo SMTP
const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp-relay.brevo.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify email connection on startup
emailTransporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email error:', error.message);
  } else {
    console.log('✅ Brevo email configured successfully!');
  }
});

// Function to send beautiful HTML email notification to YOUR GMAIL
async function sendContactNotification(contactData) {
  const { name, email, subject, message } = contactData;
  const currentDate = new Date().toLocaleString('en-GB', {
    dateStyle: 'full',
    timeStyle: 'medium'
  });
  
  const mailOptions = {
    from: `"Portfolio Contact" <anil20570729@gmail.com>`,
    to: 'anil20570729@gmail.com',
    subject: `📬 New Contact Message from ${name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Message</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            line-height: 1.6;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 { font-size: 28px; margin-bottom: 10px; }
          .header p { opacity: 0.9; font-size: 14px; }
          .content { padding: 30px; }
          .field {
            margin-bottom: 25px;
            border-bottom: 1px solid #eee;
            padding-bottom: 15px;
          }
          .label {
            font-weight: bold;
            color: #667eea;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .value { color: #333; font-size: 16px; margin-top: 5px; word-wrap: break-word; }
          .message-box {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
            margin-top: 10px;
            border-left: 4px solid #667eea;
            white-space: pre-wrap;
          }
          .badge {
            display: inline-block;
            background: #4CAF50;
            color: white;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
            margin-bottom: 20px;
          }
          .actions {
            display: flex;
            gap: 15px;
            margin-top: 25px;
            flex-wrap: wrap;
          }
          .btn {
            display: inline-block;
            padding: 10px 20px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            text-align: center;
            transition: all 0.3s ease;
          }
          .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          .btn-secondary {
            background: #6c757d;
            color: white;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #999;
            border-top: 1px solid #eee;
          }
          @media (max-width: 480px) {
            .content { padding: 20px; }
            .header h1 { font-size: 22px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📬 New Message Received!</h1>
            <p>Someone just contacted you through your portfolio website</p>
          </div>
          <div class="content">
            <div style="text-align: center;"><div class="badge">✨ New Contact Form Submission ✨</div></div>
            
            <div class="field">
              <div class="label">👤 Name</div>
              <div class="value"><strong>${name}</strong></div>
            </div>
            
            <div class="field">
              <div class="label">📧 Email Address</div>
              <div class="value"><a href="mailto:${email}" style="color: #667eea;">${email}</a></div>
            </div>
            
            ${subject ? `
            <div class="field">
              <div class="label">📝 Subject</div>
              <div class="value">${subject}</div>
            </div>
            ` : ''}
            
            <div class="field">
              <div class="label">💬 Message</div>
              <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
            </div>
            
            <div class="field">
              <div class="label">⏰ Received At</div>
              <div class="value">${currentDate}</div>
            </div>
            
            <div class="actions">
              <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || 'Your message from portfolio')}" class="btn btn-primary">📧 Reply to ${name}</a>
              <a href="http://localhost:3000/admin/messages" class="btn btn-secondary">📊 View in Admin Panel</a>
            </div>
          </div>
          <div class="footer">
            <p>This is an automated notification from your Portfolio Website.</p>
            <p>You received this email because someone submitted the contact form.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await emailTransporter.sendMail(mailOptions);
    console.log(`📧 Email sent to: anil20570729@gmail.com from: ${name}`);
    return true;
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    return false;
  }
}

// ============ TEST EMAIL ROUTE ============
app.get('/api/test-email', async (req, res) => {
  console.log('📧 Test email endpoint called');
  
  try {
    const testMailOptions = {
      from: `"Portfolio Test" <anil20570729@gmail.com>`,
      to: 'anil20570729@gmail.com',
      subject: '✅ Email Test - Your Portfolio is Working!',
      text: 'Congratulations! Your portfolio email notifications are working correctly.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 10px; padding: 20px;">
          <div style="background: white; padding: 30px; border-radius: 10px;">
            <h1 style="color: #667eea;">✅ Email Working!</h1>
            <p style="color: #333; font-size: 16px;">Your portfolio email notifications are configured correctly.</p>
            <p style="color: #333;">You will now receive email alerts when someone contacts you.</p>
            <hr>
            <p style="color: #666; font-size: 12px;">Sent from your Portfolio Website</p>
          </div>
        </div>
      `
    };
    
    await emailTransporter.sendMail(testMailOptions);
    console.log('✅ Test email sent to anil20570729@gmail.com');
    res.json({ success: true, message: 'Test email sent! Check your Gmail inbox and spam folder.' });
  } catch (error) {
    console.error('❌ Test email error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ PUBLIC ROUTES ============
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

app.get('/api/public/download-cv', async (req, res) => {
  try {
    const pdfPath = path.join(__dirname, 'uploads', 'current-cv.pdf');
    const docxPath = path.join(__dirname, 'uploads', 'current-cv.docx');
    
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

// ============ CONTACT ROUTE WITH EMAIL NOTIFICATION ============
app.post('/api/public/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }
    
    // Save to database
    await Message.create({ name, email, subject, message });
    console.log(`💾 Message saved from: ${name}`);
    
    // Send email notification to your Gmail
    try {
      await sendContactNotification({ name, email, subject, message });
    } catch (emailError) {
      console.log('⚠️ Email notification failed but message was saved');
    }
    
    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully! I will get back to you soon.' 
    });
  } catch (error) {
    console.error('Contact error:', error);
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

// Profile Routes
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

// Projects Routes
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
    if (!project) return res.status(404).json({ error: 'Project not found' });
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

// Messages Routes
app.get('/api/admin/messages', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find().sort('-createdAt');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/messages/:id/read', authMiddleware, async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
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

// ============ CV UPLOAD SETUP ============
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Uploads folder created');
}

const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `current-cv${ext}`);
  }
});

const uploadCV = multer({
  storage: cvStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, ext === '.pdf' || ext === '.docx');
  }
});

app.use('/uploads', express.static(uploadDir));

// CV Routes
app.get('/api/admin/cv-info', authMiddleware, async (req, res) => {
  const pdfPath = path.join(uploadDir, 'current-cv.pdf');
  const docxPath = path.join(uploadDir, 'current-cv.docx');
  const hasCV = fs.existsSync(pdfPath) || fs.existsSync(docxPath);
  res.json({ hasCV });
});

app.post('/api/admin/upload-cv', authMiddleware, uploadCV.single('cv'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  
  console.log('✅ CV uploaded:', req.file.filename);
  const cvUrl = `/uploads/${req.file.filename}`;
  await Profile.findOneAndUpdate({}, { resumeUrl: cvUrl }, { upsert: true });
  
  res.json({ success: true, message: 'CV uploaded successfully!', file: { name: req.file.filename, url: cvUrl } });
});

// ============ CREATE DEFAULT ADMIN ============
async function createDefaultAdmin() {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword,
        email: 'admin@portfolio.com',
        role: 'admin'
      });
      console.log('✅ Default admin user created: admin / admin123');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin:', error);
  }
}

// ============ START SERVER ============
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Test API: http://localhost:${PORT}/api/public/profile`);
  console.log(`📧 Test Email: http://localhost:${PORT}/api/test-email`);
  console.log(`📁 Uploads folder: ${uploadDir}\n`);
  await createDefaultAdmin();
});