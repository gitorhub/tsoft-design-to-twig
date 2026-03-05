# Global Kaynak Referansi

## `tailwind.config.js` Kurallari

- Detaylı bakım ihtiyacında referans için bakabilirsin. Onun haricinde bakmana gerek yok. `global/tailwind.config.js`

## `custom.css` Kullanimi

- Hazir component classlari onceliklidir:
  - Butonlar: `.btn`, `.btn-primary`, `.btn-outline-primary`, `.btn-secondary`, `.btn-outline-secondary`, `.btn-light`, `.btn-dark` etc.
  - Form alanlari: `.form-control`, `.form-item`, `.form-label`, `.form-group`
  - Yapilar: `.dropdown`, `.drawer`, `.selection-dropdown`, `.table-striped`
- Twig uretirken ayni isi yapan yeni class yazmak yerine bu hazir classlari kullan.
- Detaylı bakma ihtiyacın olursa `global/custom.css`

## `common.js` Hook Kurallari

Twig tarafında js kullanmıyoruz. Js tema dizininin dışında ayrı bir yerden yükleniyor.

- İhtiyaç olmazsa hiç bakma ama js global fonksiyonlar vb için `global/common.js` a bakabilirsin.
