// Base URL for the Gemini REST API (model name is inserted at call time).
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta";

const inputEl        = document.getElementById("input");
const apiKeyEl       = document.getElementById("apiKey");
const modelSelectEl  = document.getElementById("modelSelect");
const runBtn         = document.getElementById("run");
const spinner        = document.getElementById("spinner");
const resultsEl      = document.getElementById("results");
const badgeEl        = document.getElementById("badge");
const promptEditorEl = document.getElementById("promptEditor");
const promptTextEl   = document.getElementById("promptText");
const togglePromptBtn= document.getElementById("togglePrompt");
const resetPromptBtn = document.getElementById("resetPrompt");

// Pre-fill the prompt editor with the default prompt.
promptTextEl.value = SYSTEM_PROMPT;

// Toggle the prompt editor open/closed.
togglePromptBtn.addEventListener("click", () => {
  const isHidden = promptEditorEl.classList.toggle("hidden");
  togglePromptBtn.classList.toggle("active", !isHidden);
});

// Reset the prompt textarea back to the original default.
resetPromptBtn.addEventListener("click", () => {
  promptTextEl.value = SYSTEM_PROMPT;
});

// Load a .txt file into the textarea when the user picks one.
// FileReader reads it locally — no upload, no server.
document.getElementById("fileInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    inputEl.value = ev.target.result;
    testSelectEl.value = "";   // switch dropdown to "— custom —"
  };
  reader.readAsText(file, "UTF-8");
  e.target.value = "";   // reset so the same file can be re-loaded
});

// Populate the test selector dropdown from TEST_CASES and wire up loading.
const testSelectEl = document.getElementById("testSelect");
TEST_CASES.forEach((tc, i) => {
  const opt = document.createElement("option");
  opt.value = i;
  opt.textContent = `Test ${tc.id}: ${tc.name}`;
  testSelectEl.appendChild(opt);
});

// When a test is selected, load its input into the textarea.
testSelectEl.addEventListener("change", () => {
  const idx = testSelectEl.value;
  if (idx === "") return;
  inputEl.value = TEST_CASES[parseInt(idx)].input;
});

// Pre-load the first test case so the evaluator can click Run immediately.
inputEl.value = TEST_CASES[0].input;
testSelectEl.value = "0";

// If local.js exists and defines DEV_API_KEY, pre-fill the key field (dev only).
// On the reviewer's machine local.js doesn't exist, so this variable is undefined.
if (typeof DEV_API_KEY !== "undefined" && DEV_API_KEY) {
  apiKeyEl.value = DEV_API_KEY;
}

// On click: validate inputs, call the AI, and display results (or an error).
runBtn.addEventListener("click", async () => {
  const raw   = inputEl.value.trim();
  const key   = apiKeyEl.value.trim();
  const model = modelSelectEl.value;

  if (!key) { clearResults(); renderError("Please enter your Gemini API key."); return; }
  if (!raw)  return;

  setLoading(true);
  clearResults();

  try {
    const items = await deduplicate(raw, key, model, promptTextEl.value.trim() || SYSTEM_PROMPT);
    // Pass expected answers only when a test case is active (not custom input).
    const idx = testSelectEl.value;
    const expected = idx !== "" ? TEST_CASES[parseInt(idx)].expected : null;
    renderResults(items, expected);
  } catch (err) {
    renderError(err.message);
  } finally {
    setLoading(false);
  }
});

// ── API call ─────────────────────────────────────────────────────────────────

// Sends the product list to Gemini and returns a parsed JSON array of canonical items.
// Strips markdown fences from the response before parsing, in case the model adds them.
async function deduplicate(userInput, apiKey, model, prompt) {
  const response = await fetch(`${GEMINI_BASE}/models/${model}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: `${prompt}\n\n${userInput}` }]
      }],
      generationConfig: { temperature: 0 }
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `HTTP ${response.status}`);
  }

  const data = await response.json();
  const raw  = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
  // Strip markdown fences the model may add despite the prompt instructing otherwise.
  const text = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`The AI returned non-JSON output:\n\n${text}`);
  }
}

// ── Rendering ────────────────────────────────────────────────────────────────

// Builds a result card for each canonical product with a Zap search link.
// If expected[] is provided (test mode), shows ✓ on cards that match an expected answer.
function renderResults(items, expected = null) {
  if (!items.length) {
    const msg = document.createElement("p");
    msg.className = "empty-state";
    msg.textContent = "No products found.";
    resultsEl.appendChild(msg);
    return;
  }

  updateBadge(items.length);

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    const nameRow = document.createElement("div");
    nameRow.className = "card-name-row";

    const name = document.createElement("div");
    name.className = "card-name";
    name.textContent = item.canonical;

    nameRow.appendChild(name);

    // In test mode: check if this canonical matches any expected answer.
    if (expected) {
      const canonical = item.canonical.toLowerCase();
      const matched = expected.some(exp => {
        const e = exp.toLowerCase();
        return canonical === e || canonical.includes(e) || e.includes(canonical);
      });
      const check = document.createElement("span");
      check.className = matched ? "card-check card-check--pass" : "card-check card-check--fail";
      check.textContent = matched ? "✓" : "✗";
      nameRow.appendChild(check);
    }

    const merged = document.createElement("div");
    merged.className = "card-inputs";
    merged.textContent = `Merged from: ${item.inputs.join(" · ")}`;

    const link = document.createElement("a");
    link.className = "card-link";
    link.href = `https://www.zap.co.il/search.aspx?keyword=${encodeURIComponent(item.canonical)}`;
    link.textContent = "View lowest price on Zap \u2197";
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    card.appendChild(nameRow);
    card.appendChild(merged);
    card.appendChild(link);
    resultsEl.appendChild(card);
  });
}

// Displays an error message in the results panel.
function renderError(message) {
  const box = document.createElement("div");
  box.className = "error-box";
  box.textContent = message;
  resultsEl.appendChild(box);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

// Disables the Run button and toggles the spinner while the API call is in flight.
function setLoading(on) {
  runBtn.disabled = on;
  spinner.classList.toggle("hidden", !on);
}

// Wipes the results panel and hides the product count badge before a new run.
function clearResults() {
  resultsEl.innerHTML = "";
  if (badgeEl) badgeEl.textContent = "";
  badgeEl?.classList.add("hidden");
}

// Updates the "N products" badge in the results panel header.
function updateBadge(count) {
  if (!badgeEl) return;
  badgeEl.textContent = `${count} product${count !== 1 ? "s" : ""}`;
  badgeEl.classList.remove("hidden");
}
