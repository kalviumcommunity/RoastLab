# RoastLab

Upload a selfie. Tell the AI about yourself.  
It looks, listens, and roasts you. Brutally. Then throws in a compliment so you don’t cry too hard.

---

## Project Idea

RoastLab is a playful AI app where you:
1. Upload a selfie.
2. Add a short description of yourself — quirks, habits, personality traits.
3. AI analyzes both your image and your text to craft:
   - A personalized roast  
   - A compliment for balance

It’s built to be funny, but it also serves as a practical example of combining multiple AI concepts — **Prompting**, **Structured Output**, **Function Calling**, and **RAG** — in a single, interactive application.

---

## How It Works
1. **User Input** – A selfie and a short self-description.  
2. **Backend Processing** – The AI uses image analysis and text understanding to form context.  
3. **Roast Generation** – Prompting, structured output, and function calling determine exactly how the roast is created and returned.  
4. **Output** – The roast + compliment is displayed in the UI.  

---

## AI Concepts in This Project

### 1. Prompting
We design prompts that combine both the selfie and description for maximum effect.  
Instead of “roast this person,” we give the AI context and tone guidelines, for example:  
> `"Analyze the person's photo and description, then roast them in a witty, sarcastic tone. Follow it with a light compliment."`

This ensures the AI’s output is both funny and relevant to the person’s actual look and description.

---

### 2. Structured Output
We require the AI to return a predictable JSON format so the frontend knows exactly how to display the roast and compliment.

Example:
```json
{
  "roast": "You look like you own more protein powder than actual groceries.",
  "compliment": "At least you’re dedicated… to something."
}
```
---

### 3. Function Calling

Different backend functions handle different types of input:

- `generateFromImageAndText()` – Main function that processes both selfie + description.  
- `rematchRoast()` – Option to request a new roast without re-uploading data.  

Function calling lets the AI decide which internal logic to trigger based on user input.

---

### 4. RAG (Retrieval-Augmented Generation)

Before creating the roast, the AI can query a small meme/pop culture database to pull in references.

**Example:**
- **User says:** “I’m a coffee addict who avoids parties.”  
- **RAG fetches:** Memes about caffeine, introversion, and social avoidance.  
- **AI Output:** A roast that blends these references for a sharper, more relevant burn.

---

## Tech Stack

- **Frontend** – React + Tailwind  
- **Backend** – Node.js + Express  
- **AI** – OpenAI GPT-4 Vision / Chat API  
- **Image Analysis** – CLIP / Gemini Vision / BLIP  
- **RAG Source** – Meme DB + vector store  
- **Hosting** – Vercel / Netlify

---

## Disclaimer

We roast with love.  
Upload at your own risk.
