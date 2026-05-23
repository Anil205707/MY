const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const Profile = require('../models/Profile');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Message = require('../models/Message');
const Analytics = require('../models/Analytics');

// Apply protect middleware to all routes
router.use(protect);

// ============ PROFILE ============
router.get('/profile', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    res.json(profile || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/profile', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (profile) {
      profile = await Profile.findOneAndUpdate({}, req.body, { new: true });
    } else {
      profile = await Profile.create(req.body);
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ EXPERIENCE ============
router.get('/experience', async (req, res) => {
  try {
    const experience = await Experience.find().sort('order');
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/experience', async (req, res) => {
  try {
    const experience = await Experience.create(req.body);
    res.status(201).json(experience);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/experience/:id', async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/experience/:id', async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ EDUCATION ============
router.get('/education', async (req, res) => {
  try {
    const education = await Education.find().sort('order');
    res.json(education);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/education', async (req, res) => {
  try {
    const education = await Education.create(req.body);
    res.status(201).json(education);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/education/:id', async (req, res) => {
  try {
    const education = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(education);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/education/:id', async (req, res) => {
  try {
    await Education.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ SKILLS ============
router.get('/skills', async (req, res) => {
  try {
    const skills = await Skill.find().sort('order');
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/skills', async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/skills/:id', async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/skills/:id', async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ PROJECTS ============
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort('-createdAt');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/projects', async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/projects/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ MESSAGES ============
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort('-createdAt');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/messages/:id/read', async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/messages/:id', async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ ANALYTICS ============
router.get('/analytics', async (req, res) => {
  try {
    const totalVisitors = await Analytics.countDocuments();
    const todayVisitors = await Analytics.countDocuments({
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
    });
    
    // Get page views
    const pageViews = await Analytics.aggregate([
      { $group: { _id: '$page', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      totalVisitors,
      todayVisitors,
      pageViews
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;