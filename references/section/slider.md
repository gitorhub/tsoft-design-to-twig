# Slider (`section/slider/*.twig`)

## Politika
- `.twig` bos ise ayni klasordeki diger sliderlari referans al.
- Sadece tasarimda aktif alanlari kullan.
- `SETTING.IMAGES` ile dongu kur; eksik alanlarda sabit HTML/CSS ekleme.
- `data-toggle="slider"`, `data-swiper` yapisini bozma.
- `DISPLAY_NAVIGATION`, `DISPLAY_THUMBNAIL`, `PAGINATION_TYPE`, `LOOP`, `AUTOPLAY`, `EFFECT` alanlarini null-safe tasiyarak davranis kur.
- `PERVIEW` ve `MARGIN` degerlerini dataset attribute ile yonet (`data-perview`, `data-margin`). Default değerler 0 veya '' geldiği için bizim koddan yazdıklarımız default değer olur.
- `IMG1`/`IMG2` için fallback `set` yazma (`desktopImage`, `mobileImage` vb.); doğrudan alan kontrolü kullan.
- İlk slide `eager`, diğer slide `lazyload` kuralı sadece `hero-slider` için uygulanır; diğer sliderlarda zorunlu değildir.
- Panelde section `container/fullwidth` degisebildigi icin slider kapsayicisinda `[&:not(.container_&)]:px-4` kullan; `container` modunda ekstra px yazma.
- Fullwidth seceneginde kenar boslugu icin slider/banner kapsayicisinda `[&:not(.container_&)]:px-4` kullanilir. Böylece `container` modunda zaten padding olduğu için ekstra px verilmemiş olur.
- Panelden gelen gorsellerde sabit yukseklik verme (`h-*`, `min-h-*`); oran/perspektif gorselin kendi boyutundan gelsin.
- Cizimde karsiligi olmayan alanlari (or. `IMAGE.SUBTITLE`, ekstra badge, ikinci buton) slider kodundan sil; panelde var diye otomatik render etme.

## Veri Kaynağı
- Eğer bir payload örneği sağladıysam, öncelikli olarak onu kullan.
- Herhangi bir payload verilmediyse mevcut dosyadaki değişkenlerden yararlan; gerekmedikçe aşağıdaki değişkenler listesini baz alma.
- Değişken listesi ve örnek payload için: `references/section/variables/slider.json`
