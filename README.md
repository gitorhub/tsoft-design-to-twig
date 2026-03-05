# TSOFT Design-to-Twig Skill

TSOFT OS2 projelerinde Figma kaynaklı veya dış kaynaklı tasarımları,  
mevcut yapıyı bozmadan Twig section/snippet'e dönüştürmek için AI skill.  
Codex, Cursor, Windsurf, Antigravity ve GitHub Copilot ile çalışır.

---

## Kurulum

```bash
# 1. Repo'yu klonla
git clone https://github.com/gitorhub/tsoft-design-to-twig.git ~/tsoft-design-to-twig

# 2. Kurulum scriptini çalıştır
bash ~/tsoft-design-to-twig/agents/install.sh
```

Hangi tool'ların kurulacağını script sorar, ENTER'a basınca hepsi kurulur.

### 1 Dakikada Kurulum (Tek Satir)

```bash
REPO="$HOME/tsoft-design-to-twig"; git clone https://github.com/gitorhub/tsoft-design-to-twig.git "$REPO" && bash "$REPO/agents/install.sh"
```

Not: Repo zaten varsa `git clone` yerine ilgili klasorde `git pull` yapip scripti yeniden calistirabilirsin.

---

## Güncelleme

```bash
cd ~/tsoft-design-to-twig && git pull
```

Pull sonrası tüm tool'lar otomatik güncellenir, ekstra bir şey yapmana gerek yok.

---

## Desteklenen Tool'lar

| Tool | Konum |
|------|-------|
| Codex | `~/.codex/skills/tsoft-design-to-twig/` |
| Cursor | `~/.cursor/skills/tsoft-design-to-twig/` (+ `~/.cursor/rules/tsoft-design-to-twig.mdc`) |
| Windsurf | `~/.windsurf/skills/tsoft-design-to-twig/` (+ `~/.windsurf/rules/tsoft-design-to-twig.windsurfrules`) |
| Antigravity | `~/.antigravity/skills/tsoft-design-to-twig/` |
| GitHub Copilot | `~/.config/github-copilot/tsoft-design-to-twig-instructions.md` |

---

## Klasör Yapısı

```
tsoft-design-to-twig/
├── SKILL.md          ← tek kaynak
├── agents/           ← tool konfigürasyonları + install.sh
└── references/       ← section/snippet referansları
```
