---
name: tsoft-desing-to-twig
description: >
  TSOFT OS2 projelerinde Figma veya HTML/CSS tasarımlarını Twig şablonlarına dönüştürürken tema bütünlüğünü (theme.css değişkenleri, hazır global componentler) koruyarak Tailwind tabanlı ve responsive temiz kodlama yap. Keyfi özel değerler yerine en yakın Tailwind sınıflarını (text-[13px] -> text-xs), arbitrary renkler yerine semantik classları (bg-primary, text-body vb.) kullan. Üzerinde çalıştığın dosya yoluna uygun reference (references/*) dokümanını baz al. HTML içindeki 'data-*' attributelerini, macro/snippet yapılarını, sr-only gibi erişilebilirlik etiketlerini koru. Varsayılan UI kırılımı olarak sadece 'lg' breakpoint'ini esas al. Kod kalabalığından kaçın ve yorum satırı ekleme.
---

# TSOFT Tailwind Twig Section

## Is Akisi

1. Sana iletilen ve çalışman istenen dosya yolunu belirle.
2. Once mevcut `.twig` dosyasini dikkatlice oku.
3. Dosya yoluna gore sadece ilgili reference dosyasini bir defa oku (`section`, `snippets`) den hangisi ise
4. `assets/css/theme.css` dosyasında tasarıma göre değiştirmen gereken root değişkenleri varsa yorum satırından çıkar ve düzenle. Genelde `--radius` ve `--body-bg-color` değiştirilir. Bir defaya mahsus.
5. `assets/css/theme.css` dosyasında mevcut dosyalar tüm tasarımı etkileyen tekrar eden classlardır. Bu yüzden block-title subtitle swiper-button-\* vb. gibi kısımlar buradan bir defa değiştirilir. twig dosyalarında bunlarla iligli haricen işlem yapılmaz. - `section` icinde gorunen blok ya da sectionların baslik/alt baslik stilleri, swiper değerleri vb. `.block-title .title` / `.block-title .subtitle` `.swiper-button-next`, `.swiper-button-prev`, `.swiper-button-lg`, `.swiper-pagination`, `.swiper-pagination-bullet`, `.swiper-pagination-bullet-active` vb. ile `theme.css` tarafinda yonetilir; Twig'de tipografi karari minimum tutulur. Section başlıkları ve alt başlıkları çizimde fakrlı olsa bile tek bir merkezden sabit yönetilir. Fakrlı başıkları insan kaynaklı hata olarak yorumlar ve her section için fakrlı bir title font size vb uygulama.
6. Figma linki veya iletilen resmi iyice incele. Çünkü yorum yapmadan tasarımı responsive olarak uygulamanı istiyorum. En önemli kısım bu.
7. Figma linki varsa tasarımdaki font size, font weight, padding, konumlar vb aynen alınır. Typografi değerleri mutlaka öğren. Fakat class yazımında çıkardığın font sizelara en yakın tailwind default class değerlerini yaz. yani `text-[13px]` yerine `text-xs`, `p-[21px]` yerine `p-5` vb. yaz.
8. Figma linki değil de chat ekranına html css kod örneği yapıştırılmış ise eğer `references/css-to-tailwind.md` baz al.
8. Elementlerdeki `data-*` datasetlerini, sectiona dahil edilen macro kullanimlarini ve snippet include akislarini koru.
9. Sadece aktif ve gerekli degiskenleri kullan;
10. Twig tarafinda tailwind tabanli responsive duzen kur; gereksiz kod kalabaligi olusturma. Birinci önceliğin tasarımı uygulamak ama kodları da çorbaya çevirmemek.
11. Responsive kırılımda ana referans olarak sadece `lg` breakpoint kullan; mobil ve masaüstü ayrımı için `lg` standardını uygula, onun dışında ekstra breakpoint eklemek gerekiyorsa gerçekten ihtiyaç olduğunda kullan.

## Zorunlu Uygulama Kurallari

- tailwind.config.jsde tanımlanan renkler panelden yönetilir ve değerleri. `body`, `primary`, `secondary`, `light`, `dark`, `form`. Buradaki text body yazı rengidir.
- Tasarimdaki radiuslar ve borderlar site genelinde `rounded-custom`, `border-custom`, `rounded-form`, `border-form` ile karsilanir ve tailwind configde tanımlanmıştır.
- Font tarafinda temel aile bodyde tanımlanmış `font-sans`, arapça gibi rtl durumlarında ise `font-rtl` dir. Bunlar default tanımlı olduğu için haricen kullanma. El yazısı tarzı olan ikincil font `font-secondary` dir. Çizimde varsa kullan yoksa kullanma.
- Renkleri statik hex classlari ile yazma; `bg-primary`, `text-body`, `border-form` gibi semantik tema classlari kullan. Temaya özel renkler root dizinde `setting.json`. font-secondary setting.jsonda velirtilir ya da (serif / editorial / display başlık fontu) vb tarzı olur. Primary font olan font-sans zaten bodyde tanımlı. Bu yüzden font-sans kullanma.
- `bg-[#...]`, `text-[...]`, `leading-[...]`, `border-[#...]` gibi arbitrary classlari kullanma; Figma px degeri verilmis olsa bile en yakin Tailwind default scale'i sec (`text-sm`, `border-primary`, `lg:text-2xl` vb.)
- Border ihtiyacinda sadece `border`/`border-form` kullan; globalde broder için gelen `*{border-solid border-light}` davranisini var. Border eklemek için `border` yazmak yeterli
- Container değerler için sabit `max-w[...]` yerine `container` yapisini tercih et. (`center: true`, varsayilan `padding: 1rem`)
- İhtiyaç olduğunda standart olarak hazır olan`global/custom.css` icindeki classlari (`btn`, `btn-primary`, `btn-outline-primary`,`form-control`, `dropdown`, `drawer` vb.) öncelikle kullan.
- Banner ve sliderlarda dil değişkeni kullanmaya gerek yok. Farklı bir yerde farklı bir amaçla dil değişkeni kullanacaksan `{{ t.test }}` şeklinde kullan. Dil karşılıklarını biz panelden manuel gireceğiz.
- Yuksek olasilikla gereken degiskenler kodladığın mevcut `.twig` icinde vardir; ekstra variables referanslarini sadece gerektiğinde ac.
- Tipografi ve renkleri once kapsayici seviyede ver; alt elemanlarda tekrar eden text size/color class kalabaligi olusturma.
- text-body body için tanımlanmıştır. Bu yüzden tasarımda beyaz, primary vb renk yoksa zaten bodyden renk alacaktır. haricen text-body vb demene gerek yok. Soluk yazılar için text-body/70 vb kullanabilirsin.
- RTL uyumluluğu için, Tailwind sınıflarında yönlendirmede `left/right` yerine `inline-start` ve `inline-end` varyantlarını kullan: ör. `pr-4` yerinde `pe-4`, `pl-2` yerine `ps-2` yaz.
- Menu ve dil metinlerinde müşteri tarafından içerik serbestçe yazılacağı için, tasarımda büyük harf (uppercase) olsa bile `uppercase` classı ekleme. Gerekli görürsen en fazla `capitalize` kullanabilirsin, fakat tasarımda var diye otomatik büyük harf zorunluluğu getirme.
- Pagespeed ile ilgili gerekli düzenlemeleri ihtiyaca göre ekle, ancak mevcut `sr-only`, `aria-label` gibi erişilebilirlik öğelerini kaldırma veya silme. İhtiyaç varsa ekle.
- Yazı içerikleri ve `|raw` ile kullan. çünkü bazen panelden html kod girilebiliyor.
- Eğer döngü ile gelen tasarımlarda bir tanesi farklı ise, o hover durumundaki görüntüdür. En kapsayıcı döngü elementinde tailwind `group` classı yoksa ekle ve group-hover durumunda hover durumunu kodla. Hero Slider hariç `swiper-slide-active` yerine `group-hover` tercih et.
- Follow WCAG requirements for accessibility
- Kodlama esnasında kodları azaltmak için vb {% set .. %} işlemleri yapma. Olanla normal kodla.
- Header, Footer inline SVG'lerde `fill="currentColor"` / `stroke="currentColor"` kullanarak rengi kapsayıcıdan miras al.
- Figmadan ikonu bulamazsan, lucide.com'dan uygun bir ikon seçebilirsin. Ancak, tüm kullanımlarında ikonların birbiriyle tutarlı olmasına dikkat et. Örneğin, aynı türde (cart gibi) ikonların farklı versiyonlarını kullanma; tüm projede tek bir tip ikon kullan.
- `alt="..." title="..."> ` gibi alanlarda `|raw` kullanma `|striptags` kullan. Çünkü panelden bazen html olarak gelebilri tırnak işaretinden dolayı vb kod patlar.
- Kodlama veya düzenleme yaparken aralarda yorum yazma.

## Dosya Yolu -> Reference Eşleme

Sadece kodlama yapacağın references dosyasını oku. İhtiyacın olmayanları okuma.

- `/section/header/*.twig` -> `references/section/header.md`
- `/section/footer/*.twig` -> `references/section/footer.md`
- `/section/slider/*.twig` -> `references/section/slider.md`(Pagination, navigation vb. veya yan yana +4 resim varsa muhtemelen sliderdır)
- `/section/banner/*.twig` -> `references/section/banner.md` 
- `/section/showcase/*.twig` -> `references/section/showcase.md` (Slider veya grid şeklinde ürün kartlarıdır. Tablı ya da tabsız olabilir. Anasayfadaki ürünler showcase yani vitrindir.)
- `/section/product-list/*.twig` -> `references/section/product-list.md` (Sadece ürün liste sayfasında olur. Genelde yan yana 3lü ya da 4 lü görünümle alta doğru uzar.  )
- `/section/product-detail/*.twig` -> `references/section/product-detail.md`
- `/section/filter/*.twig` -> `references/section/filter.md` (dosya .twig uzantısı olsa da vuejs yazılmıştır.)
- `/section/blog-recent-post/*.twig` -> `references/section/blog-recent-post.md` 
- `/snippets/product-list/product-card/*.twig` -> `references/snippets/product-card.md` (showcase (vitrin) ve product-list içinde geçen ürün kartlarıdır.)
- `/snippets/**/*` -> `references/snippets.md`

Figma uygulama politikasi icin `references/figma.md` dosyasini uygula.
Chat ekranına yapıştırılan Html + css to tailwind uygulama politikasi icin `references/css-to-tailwind.md` dosyasini uygula.
Ortak davranis icin sadece ihtiyaç halinde  `references/global.md` dosyasini uygula.
