# Contributing

Bu repo herkese aciktir. Katki modeli:
- Fork et
- Duzenleme yap
- PR (Pull Request) gonder
- Maintainer uygun gorurse merge eder

## Hızlı Akis

```bash
git clone https://github.com/<your-username>/tsoft-design-to-twig.git
cd tsoft-design-to-twig
git checkout -b feat/short-description
# degisiklikler...
git add .
git commit -m "feat: short description"
git push origin feat/short-description
```

Sonra GitHub uzerinden bu repoya PR ac.

## Basit Kurallar

- Mumkun oldugunca kucuk ve odakli PR gonder.
- Mevcut davranisi bozma; geriye donuk uyumlulugu koru.
- Tool path'leri kullaniciya ozel (statik) olmasin.
- `SKILL.md` degisiyorsa gerekli `references/*` guncellemelerini de ekle.
- Installer degisikliginde `README.md` de ilgili komutlari guncelle.

## Branch ve Commit Onerisi

- Branch:
  - `feat/<konu>`
  - `fix/<konu>`
  - `docs/<konu>`
- Commit:
  - `feat: ...`
  - `fix: ...`
  - `docs: ...`
  - `chore: ...`

## PR Acarken

PR aciklamasinda su 4 soruyu cevapla:
1. Ne degisti?
2. Neden gerekli?
3. Nasil test edildi?
4. Kapsam disi bir sey var mi?

## Review ve Merge

- Maintainer gerekli gorurse degisiklik ister.
- Uygun PR'ler squash merge ile birlestirilebilir.
