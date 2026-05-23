const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  console.log('=== Brevo SMTP Test ===');
  console.log('Host:', process.env.EMAIL_HOST);
  console.log('Port:', process.env.EMAIL_PORT);
  console.log('User:', process.env.EMAIL_USER);
  console.log('Pass:', process.env.EMAIL_PASS);
  console.log('------------------------');
  
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  
  try {
    await transporter.verify();
    console.log('✅ Connection successful!');
    
    const info = await transporter.sendMail({
      from: `"Portfolio Test" <${process.env.EMAIL_USER}>`,
      to: 'anil20570729@gmail.com',
      subject: '✅ Brevo Test - Your Portfolio is Working!',
      text: 'If you receive this email, your portfolio email notifications are working correctly.',
      html: '<h1>✅ Success!</h1><p>Your Brevo SMTP is configured correctly. You will now receive email notifications when someone contacts you through your portfolio website.</p>'
    });
    
    console.log('✅ Test email sent! Check anil20570729@gmail.com');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testEmail();