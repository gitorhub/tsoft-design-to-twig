# Footer (`section/footer/*.twig`)

## Politika
- Mevcut kod varsa once `.twig`i oku, sadece gorunumu duzenle.
- Responsive ve mobil accordion/drawer akisini bozma.
- Tasarimda kullanilmayan payload alanlarini yazma.
- Sosyal/odeme ikonlarinda gorsel yoksa `img` basma.
- `MENU_PAYMENT_ICONS` alani standart kalabilir; gereksiz yeniden kurgulama yapma.
- `text-[..]`, `bg-[#..]`, `border-[#..]` gibi classlardan kacin.
- Newsletter form hata metninde form scope'unda `[&_.form-error]:text-center` (gerektiginde responsive varyanti) kullan.

## Menu Kaynaklari
- `MENU_FOOTER = menu('MENU_FOOTER')`
- `MENU_SOCIAL = menu('MENU_SOCIAL')`
- `MENU_PAYMENT_ICONS = menu('MENU_PAYMENT_ICONS')`

## Veri Kaynagi
- Degisken listesi ve ornek payload icin: `references/section/variables/footer.json`
- Ek global degiskenler icin: `references/global.md`


- **Harici ikon paketi ekleme yasak.**

  - Footer: adres, telefon, WhatsApp, mail
  - İkon tasarımda yoksa koda ekleme; mevcutta varsa kaldır.