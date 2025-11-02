# ⚡ QuickNano — Rewrite & Summarize with Chrome’s Built-In AI

QuickNano is a Chrome extension that uses **Google Chrome’s built-in Gemini Nano APIs** to simplify or summarize web content directly from the right-click (context) menu.  
It’s lightweight, privacy-friendly, and works entirely **on-device** using Chrome’s new AI capabilities — no API keys or external services required.

## 🧠 Features

### 📝 Rewrite & Explain  
Select any text → Right-click → Choose **“Rewrite & Explain”**  
→ Get a **simpler explanation** in plain English.

### ⚡ TL;DR Summary  
Right-click anywhere (no selection needed) → Choose **“Summarize This Page → TL;DR Summary”**  
→ Generates a **short, concise overview** of the entire page.

### 📌 Key Points Summary  
Right-click anywhere → Choose **“Summarize This Page → Key Points Summary”**  
→ Extracts the **main bullet points** from the page.


## 🧩 Requirements

- **Chrome 128+** (with **Gemini Nano / Built-in AI APIs** enabled)
- **Built-in AI developer flag ON**
  - Visit: `chrome://flags/#prompt-api-for-gemini-nano`
  - Set it to **Enabled**
  - Restart Chrome

## ⚙️ Installation (for Testing)

1. Clone or download this repo:
   ```
   git clone https://github.com/yourusername/quicknano.git
   cd quicknano
   ```
   
2. Build or prepare the extension (if using TypeScript):
  ```
  npm install
  npm run build
  ```
This will generate a dist/ folder containing the final extension files.

3. Open Chrome and go to:
  ```chrome://extensions/```

4. Enable Developer Mode (top-right corner).

5. Click “Load unpacked” and select your dist/ folder.

✅ Done! QuickNano should now appear in your extensions list.
