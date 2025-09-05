// server/routes/dalleRoutes.js (with enhanced error logging)

import express from 'express';
import OpenAI from 'openai';
import * as dotenv from 'dotenv'; // Ensure dotenv is imported and configured here too if it's not in index.js

dotenv.config(); // Make sure dotenv is configured in this file if it's the only place API_KEY is used

const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

router.route('/').get((req, res) => {
    res.send('Hello from DALL-E!');
});

router.route('/').post(async (req, res) => {
    try {
        const { prompt } = req.body;

        // Log the API Key being used (for debugging only, remove in production)
        console.log('Using OpenAI API Key (last 4 chars):', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.slice(-4) : 'N/A');

        const aiResponse = await openai.images.generate({
            prompt,
            n: 1,
            size: '1024x1024',
            response_format: 'b64_json',
        });

        const image = aiResponse.data[0].b64_json;
        res.status(200).json({ photo: image });
    } catch (error) {
        console.error('------- Backend DALL-E Route Error -------');
        console.error('Error message:', error.message);
        console.error('Full error object:', error); // Log the entire error object
        if (error.response) {
            console.error('OpenAI API Error Status:', error.response.status);
            console.error('OpenAI API Error Data:', error.response.data); // This is likely the "Incorrect" message
           res.status(error.response.status).json({ success: false, error: error.response.data }); // Send back the actual error from OpenAI
        } else {
           res.status(500).json({ success: false, error: error.message });

        }
        console.error('-----------------------------------------');
    }
});

export default router;