const jwt = require('jsonwebtoken');
require('dotenv').config();

async function testApi() {
  try {
    const token = jwt.sign({ id: '69f94c6b41a074164128487a' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    const response = await fetch('http://localhost:5000/api/dashboard/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const data = await response.json();
    console.log('Full Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

testApi();