import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ✅ only server should use this
});

app.post("/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await client.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    });
    res.json({ url: response.data[0].url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Image generation failed" });
  }
});
