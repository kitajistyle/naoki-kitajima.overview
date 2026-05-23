---
title: "Why New Grads Should Use Obsidian × AI: A Journey from Frontend to SRE"
date: "2026-05-23"
tags: ["Obsidian", "AI", "SRE", "Career", "Productivity"]
excerpt: "How a new graduate engineer transitioning from frontend to SRE manages overwhelming daily learning and makes team contributions using 'Obsidian × Gemini CLI'. Learn the setup guide."
---

## Introduction: About Me

Nice to meet you. I joined a megaventure as a new graduate frontend engineer, but before I knew it, my transformation into an SRE began.

Every day was filled with new things—infrastructure concepts, monitoring designs, on-call responses... there was so much to learn that my head was on the verge of exploding.

What I've been hooked on lately is the combination of **Obsidian × Gemini CLI**.
In this article, I will write about how I, as a new graduate engineer, organize my daily learning and have started to contribute to my team.

---

## Common New Grad Struggles: Do You Face These Problems?

After working for a while after joining the company, don't you find yourself in these situations?

- You take notes on what you studied, but you never look back at them.
- You want to reflect on your work, but you don't know how to write it.
- You want to share knowledge at team study sessions, but your ideas aren't organized.
- Every time you ask a senior engineer a question, you feel self-hatred thinking, "I asked this before..."
- Notes that you swear you wrote in Notion have gone missing.

This becomes especially evident when a role change is involved (frontend to SRE in my case). The amount of things to relearn doubles, and knowledge management issues surface all at once.

There are also issues unique to new grads.
**You know what you lack, but you don't have a record of 'what you learned and how,'** so your growth is hard to see. In evaluation meetings, you tend to fall into the trap of being unable to articulate what you have done.

---

## What Obsidian Can Solve

Obsidian is a note-taking app that stores `.md` files locally.
What makes it different from Notion or Confluence? The key point is that **"your files are on your own PC."**

This has significant implications for AI integration, which I'll explain later.

Here is how I structure my Vault (note storage):

```
Obsidian Vault/
├── 00_Inbox/          # Write here first
├── 01_Daily/          # Daily reflections
├── 02_Learning/       # Study notes (SRE, infra, frontend, etc.)
├── 03_Projects/       # Project-specific notes
├── 04_Sharing/        # Article drafts for team sharing
├── _Templates/        # Template storage
└── _Attachments/      # Images and diagrams
```

**Only one rule: If in doubt, write to 00_Inbox.**

If you try to build the perfect structure from the start, the structure itself becomes the goal. Just write first, and organize later. That is enough.

---

## What You Can Do with Gemini CLI × Terminal Plugin

Here comes the main topic.

By installing a Terminal Plugin in Obsidian, you can use the terminal without leaving the Obsidian screen. Just by typing `gemini`, **the AI can directly read and manipulate files in your Vault**.

### What I Actually Do

**① Automating Weekly Summaries from Daily Notes**

```
> Read all my notes for this week in @01_Daily/ and
  organize what I learned by technology category
```

Scattered notes written from Monday to Friday are converted into a weekly summary.

**② Creating Article Outlines from Study Notes**

```
> Based on the notes in @02_Learning/SRE/,
  propose 3 topics that I could talk about at a team study session
```

This solves the problem of "studying but not having anything to share."

**③ Using Templates**

---

## Tips for Preparing Templates

I recommend combining the Templater plugin with Gemini CLI.

**Daily Note Template (Example)**

```markdown
---
date: {{date:YYYY-MM-DD}}
tags: [daily, {{date:dddd}}]
---

## Today's Tasks

## Blockers & Questions

## Learnings & Discoveries

## Tomorrow's Tasks
```

By writing daily using this template, you can simply ask Gemini CLI to "summarize this week" on the weekend to automatically generate a reflection.

**Study Note Template (Example)**

```markdown
---
topic: 
source: 
date: {{date:YYYY-MM-DD}}
tags: [learning]
---

## Key Takeaway (Within 3 lines)

## Why It Matters

## Practical Application at Work

## References
```

Just having a section for "Practical Application at Work" makes your input much more practical.

---

## Setup Guide: Obsidian × Gemini CLI

Here are the concrete steps to build this environment on your PC.

### 1. Install Obsidian and Base Setup

- **Mac (via Homebrew):**
  ```bash
  brew install --cask obsidian
  ```
- **From Website:** Download the installer from the [Obsidian Website](https://obsidian.md/).

After installation, create a new Vault (e.g., `~/Documents/Obsidian Vault`) and set up the folder structure (`00_Inbox`, `01_Daily`, etc.).

---

### 2. Install Community Plugins

Open Obsidian settings (gear icon at bottom left), enable **"Community plugins"**, then search and install:

#### ① Templater
1. Search and install `Templater`.
2. In settings, set the template folder to `_Templates`.

#### ② Terminal
1. Search and install `Terminal` (or `Obsidian Terminal`).
2. This allows you to open a terminal pane (zsh/bash) right inside Obsidian.

---

### 3. Install Gemini CLI and Configure API Key

#### ① Install Node.js
- **Mac (via Homebrew):**
  ```bash
  brew install node
  ```

#### ② Install Gemini CLI globally
```bash
npm install -g @google/generative-ai-cli
```

#### ③ Get API Key and Set Environment Variable
1. Go to [Google AI Studio](https://aistudio.google.com/) and log in.
2. Click **"Get API key"** and create a key.
3. Add the key to your shell config (e.g., `~/.zshrc`):
   ```bash
   export GEMINI_API_KEY="AIzaSyYourKeyHere..."
   ```
4. Reload shell:
   ```bash
   source ~/.zshrc
   ```

Verify with `gemini "Hello"`.

---

### 4. Integration & Command Examples

Open the Terminal plugin in Obsidian and run commands from the Vault root:

```bash
# Analyze SRE study notes to suggest study session topics
gemini "Suggest 3 study session topics based on: $(cat 02_Learning/SRE/*.md)"
```

Since Obsidian stores files as plain Markdown, you can pipe local utilities (`cat`, `grep`, `find`) directly into the Gemini CLI to build your custom AI workflows.

---

## Conclusion: New Grads Have Unique Strengths

**\"Lack of domain knowledge, but equal AI capability\"**

You might not match senior engineers in domain knowledge or depth of experience. But when it comes to utilizing AI, experience doesn't matter. In fact, new grads are often more flexible in adopting AI tools.

**\"New grad perspectives are valuable feedback\"**

Things that senior engineers take for granted might be areas for improvement. By noting down \"why is this doc outdated?\" or \"can this process be simpler?\" in Obsidian, you can propose improvements later.

**\"Sharing daily learnings improves the team\"**

Posting notes to the wiki or sharing learnings on Slack builds trust. It also serves as evidence of your growth and achievements in evaluations.

Obsidian × AI is not just a productivity tool; it's a **powerful weapon for new graduate engineers to visualize their growth and contribute to the team**.

Give it a try!
