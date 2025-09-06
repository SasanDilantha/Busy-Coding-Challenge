'use client';
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [useImage, setUseImage] = useState(false);
  const [emailData, setEmailData] = useState({ recipient: '', subject: '', body: '' });
  const [loading, setLoading] = useState(false);

  const handleChat = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/chat_cv', { question, useImage });
      setAnswer(res.data.answer);
    } catch (error: any) {
      setAnswer('Error: ' + error.message);
    }
    setLoading(false);
  };

  const handleEmail = async () => {
    setLoading(true);
    try {
      await axios.post('/api/send_email', emailData);
      alert('Email sent!');
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">MCP Playground with Gemma 3n</h1>
      <div className="mb-4">
        <label className="block mb-2">
          <input
            type="checkbox"
            checked={useImage}
            onChange={e => setUseImage(e.target.checked)}
          />
          Use Multimodal (Image Analysis)
        </label>
        <input
          className="border p-2 w-full mb-2"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Ask about your CV (e.g., last role)"
        />
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={handleChat}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Chat with Gemma 3n'}
        </button>
        <p className="mt-2">Answer: {answer}</p>
      </div>
      <hr className="my-4" />
      <div>
        <input
          className="border p-2 w-full mb-2"
          value={emailData.recipient}
          onChange={e => setEmailData({ ...emailData, recipient: e.target.value })}
          placeholder="Recipient email"
        />
        <input
          className="border p-2 w-full mb-2"
          value={emailData.subject}
          onChange={e => setEmailData({ ...emailData, subject: e.target.value })}
          placeholder="Subject"
        />
        <textarea
          className="border p-2 w-full mb-2"
          value={emailData.body}
          onChange={e => setEmailData({ ...emailData, body: e.target.value })}
          placeholder="Email body"
        />
        <button
          className="bg-green-500 text-white p-2 rounded"
          onClick={handleEmail}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Email'}
        </button>
      </div>
    </div>
  );
}