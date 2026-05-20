const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Message = require('../models/Message');
const Analytics = require('../models/Analytics');

// @route   GET /api/public/profile
router.get('/profile', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    res.json(profile || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/public/experience
router.get('/experience', async (req, res) => {
  try {
    const experience = await Experience.find().sort('order');
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/public/education
router.get('/education', async (req, res) => {
  try {
    const education = await Education.find().sort('order');
    res.json(education);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/public/skills
router.get('/skills', async (req, res) => {
  try {
    const skills = await Skill.find().sort('order');
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/public/projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort('-createdAt');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/public/contact
router.post('/contact', async (req, res) => {
  try {
    const message = await Message.create(req.body);
    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/public/analytics
router.post('/analytics', async (req, res) => {
  try {
    await Analytics.create(req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;