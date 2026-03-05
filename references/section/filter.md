# Filter (`section/filter/*.twig`)

- Filtre (filter) alanında Tailwind kullanmayın. Sistemde Vue.js (CDN üzerinden) ekli. Kodlar vuejs ile yazılmış ve bizler javavascript tarafın müdahale edemiyoruz. Bu yüzden sadece ve sadece tasarımsal müdahale etmen lazım. 
- Checkbox ve radio alanlarının tasarımını tüm site genelinde aynı olmalı. Bu yüzden checkbox alanları için ilgili stiller yalnızca `assets/css/theme.css` dosyasındaki `.form-control[type="checkbox"]` ve `.form-control[type="radio"]` bölümlerinden düzenlenmelidir. Filtre içinde checkbox için ekstra veya inline style verilmemelidir.
- Resim, renk gibi alanların görsel ayarları panelden gelir; ancak görsellerin en-boy oranı ve görünüm ölçüleri tasarıma birebir uygun olmalı. Bu amaçla `size-*` gibi Tailwind yardımcı sınıflarıyla uygun aspect ve ölçülendirme verilmelidir. Her zaman tasarımda göründüğü gibi uygulanmalı; keyfi ölçü eklenmemeli.

## Checkbox / Radio Stilleri — `theme.css` Override Kuralı

Sistemdeki global CSS'de `.form-control[type="checkbox"]` ve `.form-control[type="radio"]` için default boyut, arkaplan ve border değerleri tanımlıdır. Tasarıma göre bu değerleri override etmek için daima `assets/css/theme.css` içindeki `.form-control[type="checkbox"], .form-control[type="radio"]` bloğunu kullan.

Override edilebilecek değerler:
- **Boyut:** `& + label > .input-checkbox, & + label > .input-radio` → `size-*` ile boyutu tasarıma göre ayarla
- **Seçilmemiş arkaplan/border:** aynı seçici üzerinde `bg-*` ve `border-*` ile düzenle
- **Seçili durum:** `&:checked + label > .input-checkbox` (ve `.checked` class varyantı) → `bg-*`, `border-*`, `before:opacity-100` ile düzenle

Twig dosyasına veya filtre içindeki herhangi bir elemana checkbox/radio için ekstra stil verme; tüm düzenleme buradan yapılır.