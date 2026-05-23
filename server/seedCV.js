const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect
mongoose.connect('mongodb://localhost:27017/portfolio');

// Schemas
const profileSchema = new mongoose.Schema({
  fullName: String, title: String, bio: String, email: String, phone: String, location: String, socialLinks: Object
});
const experienceSchema = new mongoose.Schema({ company: String, position: String, startDate: Date, endDate: Date, current: Boolean, description: [String], order: Number });
const educationSchema = new mongoose.Schema({ degree: String, institution: String, year: String, gpa: String, order: Number });
const skillSchema = new mongoose.Schema({ name: String, category: String, proficiency: Number, order: Number });
const projectSchema = new mongoose.Schema({ title: String, description: String, techStack: [String], liveUrl: String, githubUrl: String, featured: Boolean });

const Profile = mongoose.model('Profile', profileSchema);
const Experience = mongoose.model('Experience', experienceSchema);
const Education = mongoose.model('Education', educationSchema);
const Skill = mongoose.model('Skill', skillSchema);
const Project = mongoose.model('Project', projectSchema);

async function seedData() {
  try {
    // Clear existing data
    await Profile.deleteMany({});
    await Experience.deleteMany({});
    await Education.deleteMany({});
    await Skill.deleteMany({});
    await Project.deleteMany({});

    // Profile
    await Profile.create({
      fullName: 'Anil Singh',
      title: 'Computer Science Graduate | Full-Stack Developer',
      bio: 'Results-driven Computer Science undergraduate at University of Wolverhampton with hands-on experience in software engineering, full-stack web development, database systems, and application design. Strong technical foundation in programming, debugging, responsive development, API integration, and problem-solving.',
      email: 'anil20570729@gmail.com',
      phone: '+44 7311306180',
      location: 'Wolverhampton, United Kingdom',
      socialLinks: {
        github: 'https://github.com/anil205707',
        linkedin: 'https://linkedin.com/in/anil-singh',
        twitter: ''
      }
    });

    // Experience
    await Experience.create({
      company: 'Burger & Sauces',
      position: 'Restaurant Manager',
      startDate: '2023-07-01',
      endDate: null,
      current: true,
      description: [
        'Managing and supervising a team of 8+ staff members',
        'Improving operational efficiency in high-pressure environments',
        'Training new employees on service standards and workplace processes',
        'Resolving customer concerns effectively while maintaining service quality'
      ],
      order: 1
    });

    await Experience.create({
      company: 'Bunk Cocktail Bar',
      position: 'Kitchen Assistant',
      startDate: '2023-03-01',
      endDate: '2023-06-01',
      current: false,
      description: [
        'Supported kitchen operations and food preparation',
        'Maintained quality, hygiene, and safety standards',
        'Worked effectively within a fast-paced team environment'
      ],
      order: 2
    });

    // Education
    await Education.create({
      degree: 'Bachelor of Science (BSc Hons) in Computer Science',
      institution: 'University of Wolverhampton',
      year: '2026',
      gpa: '',
      order: 1
    });

    await Education.create({
      degree: '+2 Computer Science',
      institution: 'Bluebird Secondary School, Nepal',
      year: '2021',
      gpa: 'CGPA 3.34',
      order: 2
    });

    // Skills
    const skills = [
      { name: 'Python', category: 'backend', proficiency: 85, order: 1 },
      { name: 'JavaScript', category: 'frontend', proficiency: 90, order: 2 },
      { name: 'React.js', category: 'frontend', proficiency: 85, order: 3 },
      { name: 'Node.js', category: 'backend', proficiency: 80, order: 4 },
      { name: 'PHP', category: 'backend', proficiency: 75, order: 5 },
      { name: 'MySQL', category: 'database', proficiency: 85, order: 6 },
      { name: 'MongoDB', category: 'database', proficiency: 75, order: 7 },
      { name: 'HTML5/CSS3', category: 'frontend', proficiency: 90, order: 8 },
      { name: 'Git/GitHub', category: 'tools', proficiency: 85, order: 9 }
    ];
    await Skill.insertMany(skills);

    // Projects
    await Project.create({
      title: 'Personal Portfolio Website',
      description: 'Developed a fully responsive portfolio website to showcase technical projects, academic achievements, and development skills.',
      techStack: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'React'],
      liveUrl: 'https://anil205707.github.io/anil29.com.np/',
      githubUrl: 'https://github.com/anil205707',
      featured: true
    });

    await Project.create({
      title: 'Local Market - Digital Marketplace Platform',
      description: 'Developed a marketplace platform connecting local buyers and sellers with secure authentication and admin dashboard.',
      techStack: ['PHP', 'CodeIgniter', 'MySQL', 'AJAX', 'Bootstrap'],
      liveUrl: '',
      githubUrl: '',
      featured: true
    });

    await Project.create({
      title: 'ElectroMart - Electronics Marketplace',
      description: 'Designed and developed a secure marketplace for second-hand electronic devices with product search and category filtering.',
      techStack: ['PHP', 'CodeIgniter', 'MySQL', 'JavaScript'],
      liveUrl: '',
      githubUrl: '',
      featured: true
    });

    await Project.create({
      title: 'PrepMaster Nepal - Online Learning Platform',
      description: 'Developed a subscription-based educational platform for entrance exam preparation with authentication and analytics.',
      techStack: ['Next.js', 'React.js', 'Node.js', 'MongoDB'],
      liveUrl: '',
      githubUrl: '',
      featured: false
    });

    console.log('✅ All CV data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();