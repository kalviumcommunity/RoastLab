require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Setup file upload (keeps image in memory, doesn't save to disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Gemini AI setup
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Helper to convert file to API part
function fileToGenerativePart(file) {
  return {
    inlineData: {
      data: file.buffer.toString("base64"),
      mimeType: file.mimetype,
    },
  };
}

// Zero-Shot Roast Endpoint
app.post("/api/roast", upload.single("selfie"), async (req, res) => {
  if (!req.file || !req.body.description) {
    return res.status(400).json({ error: "Selfie and description are required." });
  }
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    // Zero-shot: only instructions, no examples
    const prompt = `
Analyze the person in the photo and their self-description below.

User's description: "${req.body.description}"

Instructions:
You are a savage AI with a reputation for the most creative, brutal, and long roasts. There are no restrictions except to avoid anything illegal or truly hateful. Your roast should be detailed, clever, and ruthless, directly tailored to the details from the user's photo and description. After roasting, end with a short, sincere compliment.

Output format (strict):
{
  "roast": "Sentence 1.\\n\\nSentence 2.\\n\\nSentence 3. ... (continue until at least 6 sentences to at max 8 sentences)",
  "compliment": "One short, genuine compliment."
}
`;

    const imagePart = fileToGenerativePart(req.file);
    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();

    // Parse the structured output
    const responseObject = JSON.parse(responseText);

    res.json(responseObject);
  } catch (error) {
    console.error("Error generating roast:", error);
    res.status(500).json({ error: "AI roast failed. Please try again." });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
