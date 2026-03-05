# Header (`section/header/*.twig`)

## Politika
- Mevcut kodlar varsa once `.twig` dosyasini oku; sadece gorunumu duzenle.
- Responsive ve mobil menu snippet akisini bozma.
- Tasarimda kullanilmayan payload alanlarini yazma.
- Menu fonksiyonlarini mevcut yapida kullan.
- Panelden gelen metinlerde (ozellikle `MENU_*`, `t.*`) zorunlu `uppercase/lowercase/capitalize` uygulama.
- `text-[..]`, `bg-[#..]`, `border-[#..]` gibi classlardan kacin.
- Search/favorite/account/cart ikonlarini inline SVG kullan; ikon renkleri `currentColor` olmali.
- Figma ikon-only aksiyonlarda ikon yanina desktop text etiketi basma (`sr-only` kalabilir).
- Desktop yerlesimde menu dagilimi:
  - logo ortada ise logo solu veya ana menu: `MENU_MAIN`
  - logo ordeda ise logo sagi veya ikincil yan menü: `MENU_HEADER`
  - ust menu veya header içinde varsa kampanya/duyuru alani: `MENU_TOP`
- Search ikon modunda ise ve açık input değilse inline toggle modeli kullan:
  - Ikon `onclick` ile `.search-form` uzerinde `active` toggle.
  - Ayni `onclick` icinde `.search-form [type=search]` focus.
  - Search form kapsayicisi: `fixed ... hidden [&.active]:flex ... search-form`.
  - Backdrop tiklamasi ile inline `onclick` ile kapatma.
  - `snippets/header/mobile-menu/*.twig` yolunda, çizime uygun `slider` veya `default` (accordion) dosyası varsa çizime göre sadece görünümü düzenle. Çalışma fonksiyonlarını koru. Bu dosya yolunda dosya yoksa işlem yapma, default temadan çeker.


## Menu Kaynaklari
- `MENU_TOP = menu('MENU_TOP')`
- `MENU_HEADER = menu('MENU_HEADER')`
- `MENU_MAIN = menu('MENU_MAIN')`

## Veri Kaynagi
- Öncelikle mevcut dosyadaki değişkenleri kullan; gerekmedikçe aşağıdaki değişken listesini referans alma.
- Degisken listesi ve ornek payload icin: `references/section/variables/header.json`
- Ek global degiskenler icin: `references/global.md`


- **Sadece aşağıdaki UI chrome ikonları** inline SVG olarak gömülür:
  - Header: üye, sepet, arama, favori