# Zap Product Deduplicator

## About Me

**Name:** Daniel Beja

**Email:** danielbeja10@gmail.com

**LinkedIn:** [daniel-beja-a48831283](https://www.linkedin.com/in/daniel-beja-a48831283/)

**GitHub:** [danielbeja10](https://github.com/danielbeja10)

---

## How to Run

**Option 1 — Run instantly in the browser (no setup needed):**

👉 [https://danielbeja10.github.io/GenAI-task-for-ZAP/](https://danielbeja10.github.io/GenAI-task-for-ZAP/)

**Option 2 — Run locally:**

1. Clone or download the repository
2. Open `index.html` in any modern browser - no server, no install, no build step needed
3. Enter your [Gemini API key](https://aistudio.google.com/apikey) in the API key field
4. Click **Run** - the first test case is pre-loaded so you can see a result immediately

## How to Use

**Loading a product list:**
- Type or paste directly into the text area - any format works (newlines, commas, semicolons, Hebrew, English, or mixed)
- Use the **Load test** dropdown to switch between 5 built-in edge-case examples
- Click **Load .txt** to import a plain text file from your computer

**Choosing a model:**
- The model field defaults to `gemini-2.5-flash` (stable, recommended)
- You can type any valid Gemini model ID to override it

**Editing the prompt:**
- The system prompt is always visible below the input area
- Click **Edit Prompt** to enable editing — the prompt window turns amber to indicate edit mode
- Click **Done Editing** to lock it back to read-only
- Click **Reset to default** (visible in edit mode) to restore the original prompt at any time

**Reading the results:**
- Each card shows the canonical product name and the inputs that were merged into it
- Click **View lowest price on Zap ↗** to open a live search on Zap's price-comparison engine
- When running a built-in test case, each card shows a pass/fail indicator:
  - **✓** (green) — the AI's output matched the expected canonical name for that product
  - **✗** (red) — the AI returned a name that didn't match the expected answer
  - These indicators only appear for the 5 built-in test cases, not for custom input

---

## הסברים טכניים

### שלבים של כתיבת הפרומפט

#### שלב 1 - ניתוח הקלט

1. **שגיאות כתיב** - עלולות להיות שגיאות כתיב ברשימת המוצרים לכן המודל מתקן אך ורק כאשר אין דו-משמעות.
2. **רמת פירוט משתנה** - מוצרים יכולים להיות שמות כלליים מאוד כמו `samsung galaxy` ועד שמות ספציפיים כמו `samsung galaxy s23 264gb blue`. לכן המודל אינו מוסיף מידע מעצמו, ומבדיל בין דגמים זהים בעלי מאפיינים חומרתיים שונים (לדוגמה: `samsung galaxy s23 264gb blue` לעומת `samsung galaxy s23 128gb blue`).
3. **פורמט הרשימה** - כל רשימה נראית אחרת: ההפרדה בין מוצרים יכולה להיות בנקודות, פסיקים, כוכביות, שורה אנכית, או רשימה אופקית. לכן היה חשוב שהפרומפט יידע להתמודד עם כל סוג של רשימה.
4. **עברית לאנגלית** - כאשר שם מוצר כתוב בעברית, המודל ממיר אותו לאנגלית לפני ההשוואה, כך שמוצרים זהים בשפות שונות יאוחדו (לדוגמה: גלקסי = galaxy).

#### שלב 2 - ניתוח הפלט

הפלט צריך להיות ספציפי כדי שנוכל לנתח אותו בקוד. לכן הנחיתי את המודל להחזיר תשובה בפורמט JSON בלבד, ללא כל תוספת טקסט. כך ניתן להכניס את הפלט ישירות לקוד ולבצע עליו מניפולציות בצורה נוחה.

#### שלב 3 - דוגמאות (Few-shot Prompting)

השתמשתי ב-few-shot prompting: הצגתי למודל הן את מבנה ה-JSON הרצוי והן מספר דוגמאות של input/output בדיוק כפי שנדרש. כך מנעתי אי הבנות וחידדתי את הדגשים עבור המודל.

---

### שיקולים בבניית הפרומפט

קו המחשבה שלי נע בין שתי גישות:

**גישה 1 - כתיבה ידנית**
כתבתי בעצמי את כל הנקודות החשובות, שלחתי למודל, והוא החזיר אותן מסודרות ומנוסחות בצורה יעילה ומוכנה לשליחה למודל אחר להפעלה על רשימה.
- יתרון: שליטה מלאה על הפרומפט ועל השיח מול המודל.
- חסרון: אין ודאות שהדגשים מספיקים, ועלול להיות דאטה שיחזיר שגיאה על רשימת מוצרים מסוימת.

**גישה 2 - כתיבה אוטומטית על ידי AI**
כתיבת פרומפט ראשוני + דוגמאות, הרצת לולאה שמשווה את תשובות המודל לתשובות הצפויות ומתקנת את הפרומפט בהתאם - עד שכל הדוגמאות מתקבלות.
- יתרון: אסמכתא שהפרומפט עובד על מספר דוגמאות.
- חסרונות: מצריך כמות גדולה של דאטה. 
		עלול ליצור overfitting ולשגות על דאטה חדש.

**ההחלטה:** בחרתי בגישה הראשונה - רציתי שליטה מלאה על הפרומפט, ולא היו לי מספיק דוגמאות לגישה מבוססת למידת מכונה. ביצעתי בדיקה ידנית על מספר דוגמאות שיצרתי.

> לו היו לי כמות דוגמאות גדולה, הייתי משתמש ב-cross validation למניעת overfitting ובוחר בגישה השנייה.

---

### איתור המחיר הנמוך ביותר

מציאת המחיר הנמוך ביותר מצריכה משאבים רבים - סריקת אתרים, אחסון נתונים ב-database, ומיון תוצאות. מכיוון שכל מהותו של ZAP היא השוואת מחירים, החלטתי להשתמש בו: לכל מוצר שהמודל מחזיר, נוצר לינק לחיפוש אותו מוצר ב-ZAP.

שיקול חשוב: חשבתי תחילה לשלוף את המחיר ישירות מ-ZAP, אך לאחר בדיקה הבנתי שקריאות סיסטמתיות לאתר עלולות לגרום לחסימה מצד ZAP. לכן הסתפקתי ביצירת לינק בלבד.
