import dotenv from 'dotenv';
dotenv.config();
fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + process.env.GROQ_API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'llama-3.1-8b-instant',
    messages: [{role: 'user', content: 'hello'}]
  })
}).then(r => r.text()).then(console.log);
