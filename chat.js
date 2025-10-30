/*
  This is your new, secure backend.
  This file lives in the folder: /netlify/functions/
  It runs on Netlify's servers, not in the user's browser.
*/

// The Google Gemini API URL
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent";

// The Netlify handler function
exports.handler = async (event) => {
  
  // 1. Get the secret API key from Netlify's "Environment Variables"
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key is not configured." })
    };
  }

  // 2. Get the chat payload (history and system instruction) from the frontend
  const payload = JSON.parse(event.body);

  if (!payload) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "No payload provided." })
    };
  }

  try {
    // 3. Securely call the Gemini API from the server
    const response = await fetch(API_URL + `?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload) // Pass the payload from the frontend
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Gemini API error! status: ${response.status} ${errorBody}`);
    }

    const result = await response.json();

    // 4. Send the Gemini response back to the frontend
    return {
      statusCode: 200,
      body: JSON.stringify(result) // Pass the full Gemini response back
    };

  } catch (error) {
    console.error("Error in Netlify function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
