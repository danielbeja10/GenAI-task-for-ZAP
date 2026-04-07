# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the project

Open `index.html` directly in a browser — no build step, no server, no `npm install`.

**API key:** Enter your Gemini API key in the input field in the UI — no files to set up. The key is never stored.

## Architecture

Vanilla HTML + CSS + JavaScript (ES modules). Three logical layers:

- **Prompt** (`prompt.js`) — the system prompt sent to Gemini. Edit this to change deduplication behavior. Contains 3 few-shot examples covering Hebrew/English merge, split-by-specs, and typo fixing.
- **App logic** (`main.js`) — calls the Gemini API (`gemini-1.5-flash`, temperature 0), parses the JSON response, and renders result cards. DOM elements are built with `createElement`/`textContent` (no `innerHTML` on user data). Uses globals from `prompt.js` and `test-set.js` (plain scripts, not ES modules — required for `file://` compatibility).
- **UI** (`index.html` + `style.css`) — two-column grid. Left: textarea pre-loaded from `test-set.js`. Right: result cards with Zap search links.

## Gemini API

Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=KEY`  
Temperature is set to `0` for deterministic output. The AI receives raw user text and must return only a JSON array — no fences, no prose.

## Test cases

`test-cases.js` — 5 test cases with inputs and expected canonical outputs. The dropdown in the UI loads any of them into the textarea. Also used by `main.js` to pre-load the first case on startup.
