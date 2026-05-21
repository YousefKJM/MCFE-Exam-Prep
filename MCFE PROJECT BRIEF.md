# MCFE Exam Prep App — Project Brief

# For Claude Code continuity

## Overview

A React JSX single-file exam prep app for Yousef Majeed (Senior Cybersecurity Analyst, SABIC)
preparing for the MCFE (Magnet Certified Forensics Examiner) certification.

**File:** mcfe-exam-prep.jsx  
**Framework:** React (single .jsx file, no build step — runs directly in Claude.ai artifacts)  
**Size:** ~3,500 lines  
**State management:** useState hooks only, all at top level of App component

-----

## The Actual Exam

**NOT the Lewis Case from training. The REAL exam case is:**

- **Case:** Baldwin/Burgess homicide + classified documents — South Bend, Indiana
- **Case #:** CSE-26-0002
- **Examiner:** Yousef Majeed
- **Axiom version:** 10.0.0.48329 (Axiom Premier Trial Key)
- **Item 1:** Dell Latitude Laptop (Brenda Baldwin) — 40.6 GB logical C: drive
- **Item 2:** Google Takeout ([BrendaBaldwin420@gmail.com](mailto:BrendaBaldwin420@gmail.com)) — 160 MB
- **Item 3:** Apple iPhone 12 (Steve Burgess) — 6.35 GB Logical+ acquisition
- **Total artifacts:** 528,097
- **Keyword hits:** 2,062,428
- **MD5 Item 1:** 17c2970c669d1c1fafaf95282d55aee8 (VERIFIED MATCH)
- **SHA1 Item 1:** 6141ae1943c33c323736312123ebbd76e4d25cb7
- **Cloud Evidence Lead:** [brendabaldwin420@gmail.com](mailto:brendabaldwin420@gmail.com) → Facebook (shown in Insights panel)
- **Current timezone in Axiom:** UTC+00:00 — NEEDS VERIFICATION (Indiana = UTC-5 or UTC-6)
- **Connections:** NOT YET BUILT (required by exam instructions)

**Download files (4x 7z parts):**

- MCFE2023Evidence.7z.001 — 11.7 GB — MD5: CFE5331E56E47ADD6D64CCB64B5FB7AB
- MCFE2023Evidence.7z.002 — 11.7 GB — MD5: 09B37D01E7094F84028BB06GA874AA8A
- MCFE2023Evidence.7z.003 — 11.7 GB — MD5: 58A58CE8D8F7C94BD57C93984D697731
- MCFE2023Evidence.7z.004 — 10.2 GB — MD5: 63F5E9F2A4D45ACC555E7752485A6AAD

-----

## App Architecture

### All Views (view state values)

|View     |Button Label          |Purpose                                                                    |
|---------|----------------------|---------------------------------------------------------------------------|
|home     |—                     |Home screen with all navigation buttons                                    |
|yourexam |🎯 Baldwin/Burgess Case|Actual exam case — briefing, evidence, checklist, Q&A, strategy            |
|aiassist |🔍 AXIOM Smart Search  |Local offline search engine across 276 manual entries + 30 Q&A pairs       |
|calm     |🧠 You Got This        |Mindset, cheat sheet, navigation paths, if-stuck guide                     |
|exercises|📘 Manual Exercises    |All 12 AX200 modules with collapsible running exercises + student exercises|
|labref   |🔬 DFIR Lab Reference  |Artifacts with forensic interpretation, registry, file paths, playbooks    |
|manual   |📖 Manual Quick Search |276-entry keyword search across AX200 manual content                       |
|study    |📚 Study Guide         |Module summaries                                                           |
|mindmap  |🗺️ Mind Maps           |Visual concept maps per module                                             |
|qsetup   |🎯 Practice Exam       |Quiz configuration                                                         |
|quiz     |—                     |Active quiz view                                                           |
|tips     |⚡ Exam Tips           |Tips and strategies                                                        |
|community|🌐 Community Intel     |Reddit thread + ThinkDFIR + consensus table                                |

### Home Screen Button Order

1. 🎯 Baldwin/Burgess Case (red, full-width, “YOUR ACTUAL EXAM” badge)
1. Row: 🔍 AXIOM Smart Search + 🧠 You Got This
1. 📘 Manual Exercises (full-width green)
1. Row: 🔬 DFIR Lab Reference + 📖 Manual Quick Search
1. Grid (2x2): 📚 Study Guide, 🗺️ Mind Maps, 🎯 Practice Exam, ⚡ Exam Tips
1. 🌐 Community Intel

-----

## Data Blocks (in order in the file)

### 1. MODULES (array, top of file)

12 module objects with: id, title, color, summary, keyTopics[]

### 2. MIND_MAPS (array)

12 mind map objects with: mod, title, color, branches[]→leaves[]

### 3. MODULE_SUMMARIES (array)

12 summary objects with: mod, title, color, bullets[]

### 4. ALL_QUESTIONS (array)

75 practice questions with: id, module, q, options[4], answer (0-indexed), explanation

### 5. TIPS (array)

Exam tips with: category, icon, color, items[]

### 6. REDDIT_COMMENTS (array) — line ~301

Reddit community intel: user, upvotes, label, color, text, tip

### 7. COMMUNITY_INTEL (array)

ThinkDFIR, Notre Dame CDT, official Magnet sources

### 8. MANUAL (array) — 276 entries

Each entry: id, mod (1-12 or 0=cross-module), tag, title, body
Used by AXIOM Smart Search view. Searchable by keyword with TF-IDF scoring.

### 9. MANUAL_EXERCISES (array) — 12 modules

Each module: mod, label, title, color, running[], student

- running[]: name, steps[] (exact numbered steps from AX200 manual)
- student: questions[], answers[] (with reveal toggle)

### 10. LAB_REF (object)

Sections: artifacts[], registry[], paths[], playbooks[], quickref[]
Each artifact has: name, path, source, notes, meaning, identifies, supports, interpret
Registry entries have: hive, key, artifact, contains, forensic

-----

## All State Variables (top-level, never inside if blocks)

```javascript
view, selMod, questions, curQ, picked, score, log, done, qCount,
studyIdx, mapIdx, selBranch, practIdx, practOpen, commTab,
labTab, manualQ, manualMod, exIdx, exMod, exTab, exOpen,
examTab, aiMessages, aiInput, aiLoading, calmTab
```

-----

## Critical Architecture Rules

### 1. React Hooks Must Be Top-Level

ALL useState hooks must be declared at the top of the App() function,
NEVER inside if blocks. Violation causes React error #310.

### 2. The Recurring Orphan Bug

Every time the file is rebuilt from parts (part1.jsx + reddit_block.jsx + part2.jsx),
line ~301 gets a duplicate `const COMMUNITY_INTEL = [` injected immediately before
`const REDDIT_COMMENTS = [`. This causes “Unexpected token (302:1)”.
**Fix:** Delete the orphan `const COMMUNITY_INTEL = [` line.

### 3. Duplicate State Declarations

part2.jsx already contains `practIdx` and `practOpen`. If states are added
at the selBranch injection point AND part2 runs, these get declared twice.
**Fix:** Remove duplicate declarations at lines ~1587-1588.

### 4. JSX Apostrophes

Apostrophes in JSX text nodes (between > and <) cause “expected ;”
parser errors. Examples: `>You're ready<`, `>Baldwin's laptop<`.
**Fix:** Replace all contractions (can’t → cannot, it’s → it is, etc.)
or escape as HTML entities.
**Regex to find:** `>[^<{]*\'[^<{]*<`

### 5. Braces Must Balance

`{opens - closes}` must equal 0. Use Python to count after every edit:

```python
opens = content.count('{'); closes = content.count('}')
print(opens - closes)
```

### 6. Single-quoted strings inside double-quoted JS strings

`"shown as 'Looking for artifact data...' at bottom"` causes parser errors.
Fix by removing the inner single quotes or rephrasing.

-----

## ExamQA Component

A shared reveal-answer toggle component used by both Manual Exercises
(student exercises) and Baldwin/Burgess Practical Q&A:

```javascript
function ExamQA({ q, a, color }) {
  const [open, setOpen] = useState(false);
  // renders question + "Reveal answer" button → expands to show answer
}
```

Declared OUTSIDE the App() function, BEFORE `export default function App()`.

-----

## AXIOM Smart Search Logic (view === “aiassist”)

No API calls. Fully offline. Two-layer search:

**Layer 1 — EXTRA_KNOWLEDGE dict (30+ key-value pairs)**
Exact phrase matching against keys. Covers most common exam topics.
Keys like: “onedrive difference”, “participants”, “yellow”, “prefetch max”, etc.

**Layer 2 — MANUAL array scoring (TF-IDF-like)**

```javascript
const scoreEntry = (entry, query) => {
  // exact phrase match = 20 points
  // each word match in body = 2 points
  // title match = +5 bonus
  // tag match = +3 bonus
}
```

Returns top 3 scored entries. Results render with color-coded module badges.

-----

## Manual Exercises Structure

12 modules matching exact AX200 manual TOC:

|Module|Title                      |Running Exercises                                                                                               |Student Exercise|
|------|---------------------------|----------------------------------------------------------------------------------------------------------------|----------------|
|M1    |Installation & Overview    |Process Settings                                                                                                |No              |
|M2    |Evidence Processing        |Creating a Case                                                                                                 |No              |
|M3    |Magnet One                 |Magnet One Navigation                                                                                           |No              |
|M4    |Axiom Examine Interface    |Event Snapshot                                                                                                  |No              |
|M5    |Operating System Info      |OS Info, Timezone, Android, User Accounts, USB, LNK Files, Jump Lists, Prefetch, Event Logs                     |Yes             |
|M6    |Refined Results            |Prefetch (cont), Event Logs, Google Searches, Parsed Search Queries, Cloud Services URLs, Locally Accessed Files|Yes             |
|M7    |Web Related                |Route View, Chrome History, Typed URLs, Timeline Explorer                                                       |Yes             |
|M8    |Communications             |Emails, Email Attachments                                                                                       |Yes             |
|M9    |Encryption & Anti-Forensics|Connections, BitLocker Decryption                                                                               |Yes             |
|M10   |Cloud Introduction         |Reviewing Cloud Artifacts                                                                                       |Yes             |
|M11   |Media                      |OCR, Video Transcription, Authenticate Media, CBIR, Media Explorer                                              |Yes             |
|M12   |Reporting                  |Media Review, Reporting, Portable Case, Connections & World Map                                                 |Yes             |

**LNK Files exercise contains the critical regex:**
`^(?!.*(%|System|Windows|Program)).*[A-Z]:\\.*`

- `^` = anchor to start of string
- `(?!.*(%|system|windows|program))` = negative lookahead blocks system paths
- `.*[A-Z]:\\.* ` = matches Windows drive paths (C:, E:, etc.)

-----

## DFIR Lab Reference — Artifact Interpretation Fields

Each artifact in LAB_REF.artifacts has these fields:

- **name** — artifact display name
- **path** — exact Axiom Examine navigation path
- **source** — registry hive or file system location
- **notes** — processing/config notes
- **meaning** — plain language: what this artifact IS
- **identifies** — specific forensic facts you can establish
- **supports** — what legal/investigative conclusions it supports
- **interpret** — how to interpret findings with case-specific examples

Registry entries in LAB_REF.registry have a **forensic** field showing forensic value.

-----

## MCFE Exam Facts

- **75 questions, 120 minutes, 80% pass mark** (60/75 correct)
- Open book (searchable PDF) + open Axiom case file
- ~50% practical (from YOUR processed case) + ~25% program functions + ~25% settings
- Fail 1st attempt: immediate 2nd attempt allowed
- Fail 2nd attempt: 60-day lockout
- Certification valid: 2 years

**Lewis Case reference values (from manual exercises):**

- BitLocker Recovery Key ID: 7F6C6887-C345-4572-8C17-9B73F57BF68F
- Recovery Key: 586245-692846-693374-485111-198748-494252-599632-041833
- Katie Lewis SID: S-1-5-21-2843326786-4041582004-3801571327-1001 (RID 1001)
- Internet username: [katielewis813@gmail.com](mailto:katielewis813@gmail.com)
- OS: Windows 11 Professional, Build 26100 = version 24H2
- Guest account (RID 501): disabled
- VSN in Jump Lists: 34D98C3E → linked to “Customer Data Export Q1-Q2 2025.xlsx”

-----

## Keyword Files (also in outputs/)

- **MCFE_Baldwin_Burgess_Keywords.txt** — 255 keywords (broad net, v1)
- **MCFE_Keywords_v2_Optimized.txt** — 135 phrase-based keywords (precision, recommended)
  Both files are clean (no # comments — Axiom would search for # as a literal keyword).

**Bad keywords to AVOID (too many false hits):**

- lat (225k hits), key (222k hits), format (161k hits)
- SCF (275k hits), Desktop (191k hits), operation (157k hits)

-----

## Styling System (S object at bottom of file)

```javascript
const S = {
  root: { background:'#0a0f1e', minHeight:'100vh', padding:'16px', fontFamily:'...' },
  ptitle: { fontSize:18, fontWeight:800, color:'#e2e8f0' },
  back: { background:'#1e293b', border:'1px solid #334155', ... },
  primary: { width:'100%', padding:'13px', background:'#0ea5e9', ... },
  navrow: { display:'flex', gap:10 },
  navbtn: { flex:1, padding:'10px', background:'#1e293b', ... },
  grid4: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 },
  stats: { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', ... },
  card: { background:'#111827', border:'1px solid #1e293b', borderRadius:10, padding:14 },
}
```

Color palette: #0a0f1e (bg), #111827 (card), #1e293b (border/button), #e2e8f0 (text),
#0ea5e9 (blue), #00d4a0 (teal), #a78bfa (purple), #f87171 (red), #f59e0b (amber),
#34d399 (green), #60a5fa (light blue), #fbbf24 (yellow), #e879f9 (pink)

-----

## What Was Intentionally NOT Done

- No API calls for AI assistant (Claude mobile WebView blocks cross-origin fetch)
  → Replaced with local offline smart search using EXTRA_KNOWLEDGE + MANUAL scoring
- No browser storage (localStorage blocked in Claude artifacts)
  → All state is in-memory React useState
- No external dependencies beyond React + standard browser APIs

-----

## File Assembly (if rebuilding from scratch)

The base parts in /tmp/ (from previous session — may not persist):

- /tmp/part1.jsx — questions, tips, mind maps, module summaries (lines 1-301)
- /tmp/reddit_block.jsx — REDDIT_COMMENTS array (48 lines)
- /tmp/part2.jsx — COMMUNITY_INTEL, App function with basic views (724 lines)
  **WARNING:** Concatenating these three always introduces duplicate `const COMMUNITY_INTEL = [`
  at line 301. Always delete it after rebuild.

The recommended approach: edit the single mcfe-exam-prep.jsx file directly.

-----

*Generated from Claude.ai conversation — May 21, 2026*
*App version as of final build: 3,552 lines*