#!/bin/bash

# ============================================================
#  TSOFT Skill — Evrensel Kurulum Scripti
#  Herkes kendi bilgisayarında çalıştırabilir.
#  Mevcut hiçbir dosyayı ezmez / silmez.
#  Tüm kurulumlar symlink — git pull sonrası otomatik güncellenir.
# ============================================================

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; BOLD='\033[1m'; NC='\033[0m'

ok()   { echo -e "${GREEN}  ✓  $1${NC}"; }
skip() { echo -e "${YELLOW}  –  $1 (zaten mevcut, atlandı)${NC}"; }
err()  { echo -e "${RED}  ✗  $1${NC}"; }
info() { echo -e "     ${YELLOW}→ $1${NC}"; }

echo ""
echo -e "${BOLD}╔══════════════════════════════════════════╗${NC}"
echo -e "${BOLD}║   TSOFT Design-to-Twig — Skill Kurulum  ║${NC}"
echo -e "${BOLD}╚══════════════════════════════════════════╝${NC}"
echo ""

# ── Skill klasörünü bul ─────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"
SKILL_MD="$SKILL_DIR/SKILL.md"
AGENTS_DIR="$SKILL_DIR/agents"
SKILL_SLUG="tsoft-design-to-twig"

echo -e "📁 Skill klasörü: ${BOLD}$SKILL_DIR${NC}"
echo ""

if [ ! -f "$SKILL_MD" ]; then
  err "SKILL.md bulunamadı: $SKILL_MD"
  echo ""
  echo "  Bu scripti agents/ klasöründen çalıştırın:"
  echo "  bash /path/to/tsoft-design-to-twig/agents/install.sh"
  echo ""
  exit 1
fi

ok "SKILL.md bulundu"
echo ""

# ── Hangi tool'lar kurulsun? ────────────────────────────────
echo -e "${BOLD}Hangi tool'lar için kurulum yapılsın?${NC}"
echo "  Hepsi için ENTER, belirli tool'lar için numara gir (örn: 1 3)"
echo ""
echo "  1) Codex"
echo "  2) Cursor"
echo "  3) Windsurf"
echo "  4) Antigravity"
echo "  5) GitHub Copilot"
echo "  6) Claude"
echo "  7) Hepsi"
echo ""
read -p "Seçim [7]: " SELECTION
SELECTION="${SELECTION:-7}"

install_codex=false; install_cursor=false; install_windsurf=false
install_antigravity=false; install_copilot=false; install_claude=false

if [[ "$SELECTION" == "7" ]] || [[ "$SELECTION" == *"1"* ]]; then install_codex=true; fi
if [[ "$SELECTION" == "7" ]] || [[ "$SELECTION" == *"2"* ]]; then install_cursor=true; fi
if [[ "$SELECTION" == "7" ]] || [[ "$SELECTION" == *"3"* ]]; then install_windsurf=true; fi
if [[ "$SELECTION" == "7" ]] || [[ "$SELECTION" == *"4"* ]]; then install_antigravity=true; fi
if [[ "$SELECTION" == "7" ]] || [[ "$SELECTION" == *"5"* ]]; then install_copilot=true; fi
if [[ "$SELECTION" == "7" ]] || [[ "$SELECTION" == *"6"* ]]; then install_claude=true; fi

echo ""
echo "=================================================="

# ── Yardımcı: safe_link ─────────────────────────────────────
# Hedef yoksa symlink oluşturur, varsa dokunmaz.
safe_link() {
  local src="$1" dest_dir="$2" dest_file="$3" label="$4"
  mkdir -p "$dest_dir"
  local path="$dest_dir/$dest_file"
  if [ -e "$path" ] || [ -L "$path" ]; then
    skip "$label"
    info "$path"
  else
    ln -s "$src" "$path"
    ok "$label"
    info "$path"
  fi
}

# ── CODEX ───────────────────────────────────────────────────
if $install_codex; then
  echo ""
  echo -e "${BOLD}📦 Codex${NC}"
  safe_link "$SKILL_DIR"              "$HOME/.codex/skills"              "$SKILL_SLUG"               "Skill folder"
  safe_link "$AGENTS_DIR/openai.yaml" "$HOME/.codex/agents"              "$SKILL_SLUG.yaml"          "openai.yaml"
fi

# ── CURSOR ──────────────────────────────────────────────────
if $install_cursor; then
  echo ""
  echo -e "${BOLD}📦 Cursor${NC}"
  safe_link "$SKILL_DIR"                            "$HOME/.cursor/skills"              "$SKILL_SLUG"               "Skill folder"
  safe_link "$AGENTS_DIR/tsoft-design-to-twig.mdc" "$HOME/.cursor/rules"               "$SKILL_SLUG.mdc"          "Cursor rule (.mdc)"
fi

# ── WINDSURF ────────────────────────────────────────────────
if $install_windsurf; then
  echo ""
  echo -e "${BOLD}📦 Windsurf${NC}"
  safe_link "$SKILL_DIR"                                       "$HOME/.windsurf/skills"              "$SKILL_SLUG"                      "Skill folder"
  safe_link "$AGENTS_DIR/tsoft-design-to-twig.windsurfrules"   "$HOME/.windsurf/rules"               "$SKILL_SLUG.windsurfrules"       "Windsurf rule"
fi

# ── ANTIGRAVITY ─────────────────────────────────────────────
if $install_antigravity; then
  echo ""
  echo -e "${BOLD}📦 Antigravity${NC}"
  safe_link "$SKILL_DIR"                         "$HOME/.gemini/antigravity/skills"       "$SKILL_SLUG"               "Skill folder"
  safe_link "$AGENTS_DIR/antigravity-agent.yaml" "$HOME/.gemini/antigravity/agents"       "$SKILL_SLUG.yaml"          "antigravity-agent.yaml"
fi

# ── COPILOT ─────────────────────────────────────────────────
if $install_copilot; then
  echo ""
  echo -e "${BOLD}📦 GitHub Copilot${NC}"
  safe_link "$AGENTS_DIR/copilot-instructions.md" "$HOME/.config/github-copilot" "$SKILL_SLUG-instructions.md" "copilot-instructions.md"
  info "Copilot genelde repo bazli calisir. Hedef repoda .github/copilot-instructions.md kullanin."
fi

# ── CLAUDE ──────────────────────────────────────────────────
if $install_claude; then
  echo ""
  echo -e "${BOLD}📦 Claude${NC}"
  safe_link "$SKILL_DIR" "$HOME/.claude/skills" "$SKILL_SLUG" "Skill folder"
fi

# ── Özet ────────────────────────────────────────────────────
echo ""
echo "=================================================="
echo -e "${GREEN}${BOLD}✅ Kurulum tamamlandı!${NC}"
echo ""
echo -e "${BOLD}Güncelleme almak için:${NC}"
echo "  cd $SKILL_DIR && git pull"
echo ""
echo "  git pull sonrası tüm tool'lar otomatik güncellenir."
echo "  (symlink'ler her zaman orijinal dosyaya işaret eder)"
echo ""
