# Katkı Rehberi

Bu repo herkese açıktır. **Fork et → düzenle → PR gönder**, maintainer uygun görürse birleştirir.

---

## Adım Adım Katkı

### 1. Fork et

GitHub'da sağ üst köşedeki **Fork** butonuna tıkla.  
Repo kendi hesabına kopyalanır: `github.com/<senin-kullanici-adin>/tsoft-design-to-twig`

### 2. Fork'u bilgisayarına al

> Skill'i kullanmak için orijinal repoyu `~/tsoft-design-to-twig`'e kurmuş olabilirsin.
> Geliştirme için **fork'u farklı bir konuma al**, karışmasın.

```bash
git clone https://github.com/<senin-kullanici-adin>/tsoft-design-to-twig.git
cd tsoft-design-to-twig
```

### 3. Yeni bir branch aç

```bash
git checkout -b feat/kisa-aciklama
```

### 4. Değişikliklerini yap, kaydet

```bash
git add .
git commit -m "feat: kisa aciklama"
git push origin feat/kisa-aciklama
```

### 5. PR (Pull Request) gönder

GitHub'da fork sayfana git → **Compare & pull request** butonuna tıkla → açıklamayı doldur → gönder.

---

## Basit Kurallar

- Mümkün olduğunca küçük ve odaklı PR gönder.
- Mevcut davranışı bozma; geriye dönük uyumluluğu koru.
- Tool path'leri kullanıcıya özel (statik) olmasın.
- `SKILL.md` değişiyorsa ilgili `references/*` güncellemelerini de ekle.
- Installer değişikliğinde `README.md` komutlarını da güncelle.

---

## Branch ve Commit Önerisi

| Tür | Branch | Commit |
|-----|--------|--------|
| Yeni özellik | `feat/<konu>` | `feat: ...` |
| Hata düzeltme | `fix/<konu>` | `fix: ...` |
| Dokümantasyon | `docs/<konu>` | `docs: ...` |
| Temizlik/araç | `chore/<konu>` | `chore: ...` |

---

## PR Açarken Şu 4 Soruyu Cevapla

1. Ne değişti?
2. Neden gerekli?
3. Nasıl test edildi?
4. Kapsam dışı bir şey var mı?

---

## Review ve Merge

- Maintainer gerekli görürse değişiklik ister.
- Uygun PR'ler squash merge ile birleştirilir.
