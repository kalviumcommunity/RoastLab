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

app.post("/api/roast", upload.single("selfie"), async (req, res) => {
  if (!req.file || !req.body.description) {
    return res.status(400).json({ error: "Selfie and description are required." });
  }

  // Read temperature (default 0.7)
  let temperature = 0.7;
  if (req.body.temperature) {
    const parsedTemp = parseFloat(req.body.temperature);
    if (!isNaN(parsedTemp) && parsedTemp >= 0 && parsedTemp <= 1) {
      temperature = parsedTemp;
    }
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        stopSequences: ["ENDOFROAST"],
        temperature, // Apply the temperature here!
      },
    });

    // MULTI-SHOT/Few-shot example
    const examples = [
      {
        input: 'User\'s description: "I wear socks with sandals and unironically collect rubber duckies" [photo attached]',
        output: `{
  "roast": "You look like you lost a bet at a thrift store and just kept doubling down. The duckies are lucky to have you, because you’re the only person who could make them look cool by comparison. If there’s a contest for bold choices, you’re absolutely attending it right now, socks and all. Your commitment to anti-fashion deserves an award no one wants.",
  "compliment": "Brave sense of fashion!"
}`,
      },
      {
        input: 'User\'s description: "I’m a gym bro who still can’t do a single pullup" [photo attached]',
        output: `{
  "roast": "You have more shaker bottles than actual muscles, and somehow the dumbbells are heavier than your motivation. The only thing getting shredded is your ego every time you see the pullup bar. Even your protein powder is starting to question its life choices.",
  "compliment": "Consistent dedication pays off!"
}`,
      },
      {
        input: 'User\'s description: "Aspiring comedian, lifelong introvert, wears cat t-shirts to formal events" [photo attached]',
        output: `{
  "roast": "Nothing says ‘life of the party’ like hiding in the bathroom and practicing knock-knock jokes to your reflection. Your tuxedo cat shirt? Legendary—especially at grandma’s funeral. The only thing more awkward than your punchlines is the silence that follows them.",
  "compliment": "Your individuality is inspiring."
}`
      }
    ];
    
    const userDescription = req.body.description;
    const prompt = `
Below are several examples:
${examples.map(e => `
Input:
${e.input}
Output:
${e.output}
`).join('\n')}
Now, analyze this user:

User's description: "${userDescription}"

Instructions:
Roast this user in the same detailed, humorous, roast+compliment JSON style as above. Tailor every line to their photo and description.

Output format (strict): 
{ "roast": 
"Sentence 1.\\n\\nSentence 2.\\n\\nSentence 3. ... (continue until at least 6 sentences to at max 8 sentences)", 
"compliment": "One short, genuine compliment." 
}

At the end of your response, write ENDOFROAST.
`;

    const imagePart = fileToGenerativePart(req.file);
    const result = await model.generateContent([prompt, imagePart]);
    let responseText = result.response.text();

    // Remove ENDOFROAST and any text after if present
    const stopWord = "ENDOFROAST";
    if (responseText.includes(stopWord)) {
      responseText = responseText.split(stopWord)[0];
    }

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
