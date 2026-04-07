# Zap Product Deduplicator

## About Me

**Name:**
**Email:**
**LinkedIn:**
**GitHub:**

---

## How to Run

1. Clone or download the repository
2. Open `index.html` in any modern browser — no server, no install, no build step needed
3. Enter your [Gemini API key](https://aistudio.google.com/apikey) in the API key field
4. Click **Run** — the first test case is pre-loaded so you can see a result immediately

## How to Use

**Loading a product list:**
- Type or paste directly into the text area — any format works (newlines, commas, semicolons, Hebrew, English, or mixed)
- Use the **Load test** dropdown to switch between 5 built-in edge-case examples
- Click **Load .txt** to import a plain text file from your computer

**Choosing a model:**
- The model field defaults to `gemini-2.5-flash` (stable, recommended)
- You can type any valid Gemini model ID to override it

**Editing the prompt:**
- Click **Prompt** to open the system prompt editor
- Modify it freely — click **Reset to default** to restore the original at any time

**Reading the results:**
- Each card shows the canonical product name and the inputs that were merged into it
- Click **View lowest price on Zap ↗** to open a live search on Zap's price-comparison engine
- When running a built-in test case, a **✓** (green) or **✗** (red) marks whether the AI matched the expected answer

---

## הסברים טכניים

### שיקולים בעת כתיבת הפרומפט — האם לתת לבינה המלאכותית לכתוב אותו?



### למה לבקש מהבינה המלאכותית להחזיר JSON ולא רשימה רגילה?



### שימוש בזאפ כמקור לאיתור המחיר הנמוך ביותר



### Overfitting — מה זה ולמה זה רלוונטי כאן?


