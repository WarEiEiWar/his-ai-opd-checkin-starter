# Claude Context

@AGENTS.md

## Skill Setup

Skills live in the tracked `.agents/skills/` once they are created in lesson 18 — this
starter ships none, because building them is the exercise. Claude Code discovers them
through a link at `.claude/skills`, which is per checkout and ignored by `.gitignore`.

```bash
mkdir -p .claude && ln -s ../.agents/skills .claude/skills
```

On Windows (run as Admin or in Developer Mode) create the link directly:

```bat
mklink /D ".claude\skills" "..\.agents\skills"
```

ZCode reads `.agents/skills/` directly and needs no link.
