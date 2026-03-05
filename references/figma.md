# Figma → Kod Skill Kuralları

## 1. Her zaman önce metadata

- `get_metadata(fileKey, nodeId="root")` ile node ağacını çıkar
- Hangi node'un kodlanacağını belirle
- Root page'e asla `get_design_context` atma

## 2. get_design_context — sadece hedef node

- Kodlanacak section/component'in nodeId'sini tespit et
- Sadece o node için çağır
- Büyük bir yapıysa child node'ları listele, sadece gerekli olanı hedefle
- Keyfi değer uydurma — Figma'dan gelen değerleri aynen al. Fakat kullanırken tailwind en yakın default değerini kullan.

## 3. Döngü yapılarında

- Tekrar eden card/item/list yapısı tespit edildiğinde sadece ilk child node'u çek
- Diğer node'lara bakma
- Varyant şüphesi varsa max 2-3 farklı örneği al, fazlasına bakma
- Çıkan yapıyı tekrar eden birim olarak kodla, data nereden geliyorsa ona göre tüket

## 4. Tailwind eşleştirme

- Figma değerlerini tailwind.config.js token'larıyla eşleştir
- Arbitrary value kullanma (text-[17px], bg-[#3a2b1c] gibi). Fakat [&_container]:bg-light vb kullanabilirsin.
- Örneğin `text-13px` yerine `text-sm`, `gap-25px` yerine `gap-6` gibi default karşılığını kullan
- Config'de tanımlı custom token varsa onu öncelikli kullan

## 5. get_screenshot — sadece gerekirse

- Shadow, blur, gradient görsel detayı belirsizse al
- Pixel-perfect doğrulama gerekiyorsa al
- Senden prompt ile istenirse al.
- Bunların dışında çağırma

## 6. İkon ve Görsel Yönetimi

### Panelden gelen (koda yazma, dinamik bırak):

- Banner, slider görselleri
- Sosyal medya ikonları
- Menü görselleri
- Tüm içerik resimleri
- Ürün resimleri
- Panelden gelen gorsellerde sabit yukseklik (`h-*`, `min-h-*`) verme; oran görselin kendi boyutundan gelmeli.
- Fakat resimeler ikonvari geliyorsa mesela panelden menu resmi minik simge gibi size-6 gibi vb. onlara en boy ver ki büyük resim eklediklerinde patlamasın.

### Hard-code edilecek inline SVG (sabit, değişmez):

- Header: üye, sepet, arama, favori
- Footer: adres, telefon, WhatsApp, mail

### İnline SVG kuralı:

- Tasarımda yoksa koda ekleme
- Tasarımda varsa kaldırma
- `fill="currentColor"` veya `stroke="currentColor"` kullan, rengi kapsayıcıdan miras al
### SVG İkon Zorunlu Kuralları (Katı Mod)

Header ikonları (üye, sepet, favori, arama vb.), footer ikonları (mail, konum, telefon vb.) ve ürün kartı ikonları (sepet, favori, karşılaştır, hızlı görüntüleme vb.) için:

1. İkon node'larını tespit et.
2. `node.type == VECTOR` ise:
    - `export_svg` çağırılmalı.
    - Dönen SVG markup string'i kullanılmalı.
    - SVG doğrudan HTML içine inline edilmeli.
    - Ayrı `.svg` dosyası oluşturulmamalı veya yazılmamalı.
    - `assets` klasörüne referans verilmemeli.
    - `<img>`, `background-image` veya harici dosya referansı kullanılmamalı.

3. SVG normalize kuralları:
    - `viewBox` niteliği korunmalı.
    - Tüm `fill` değerleri `fill="currentColor"` ile değiştirilmeli.
    - Inline `style` nitelikleri kaldırılmalı.
    - Gereksiz `defs`, metadata ve yorumlar varsa kaldırılmalı.
    - Path verisi değiştirilmemeli.

4. İkon bir frame içindeyse:
    - Yalnızca içteki VECTOR node'u export edilmeli.
    - Üst frame asla export edilmemeli.

5. Bu kural, tüm dosya organizasyonu veya asset yönetimi kurallarını geçersiz kılar.

SVG ikonlar asla ayrı dosya olarak kaydedilmemeli; doğrudan HTML çıktısı içine inline edilmeli.

## Öncelik sırası

metadata → design_context (hedefli) → kod → screenshot (sadece gerekirse)

## Kontrol Listesi
- [ ] Mevcut section yapısı ve JS bağlantıları korundu
- [ ] Panelden gelen veriler kullanıldı; Figma'dan sabit görsel eklenmedi
- [ ] Header/Footer ikonları inline SVG + `currentColor` ile eklendi
- [ ] Tailwind default + tema class'ları kullanıldı, arbitrary value yok
- [ ] Padding, margin, gap tasarımla 1:1 uyuşuyor
- [ ] Mobil/desktop farkları doğru uygulandı
- [ ] Container/fullwidth durumda içerik kenara yapışmıyor
- [ ] Root page'e `get_design_context` atılmadı
- [ ] Döngü yapısında yalnızca ilk node çekildi, gereksiz çağrı yapılmadı
- [ ] `get_screenshot` yalnızca gerekli durumlarda kullanıldı
- [ ] Panelden gelen içerik görsellerine sabit yükseklik verilmedi
- [ ] İkon boyutlu panel görselleri için sabit boyut (`size-*`) tanımlandı
- [ ] Tasarımda olmayan ikon koda eklenmedi, tasarımda olan ikon kaldırılmadı birebir ikon eklendi
- [ ] Tüm inline SVG'lerde `fill="currentColor"` veya `stroke="currentColor"` kullanıldı
- [ ] Varyant farkı olan döngü birimleri conditional render ile ele alındı
- [ ] Config token'ı varken arbitrary value kullanılmadı
