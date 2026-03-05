# Banner (`section/banner/*.twig`)

## Politika
- Sana hangi twig dosyasında işlem yapacağın belirtilmemiş ise isimlendirmede en ugyun hangisi ise ona işlem yap. Eğer dosya yoksa tasarıma uygun isimde  `.twig` dosyasi olustur.
- Bannerlarda panelden gelen veri disinda sabit metin/gorsel ekleme. İkon gibi görünse bile section/banner/*.twig içinde ise tüm veriler panelden dinamik gelir. 
- Sadece tasarimda aktif alanlari yaz.
- Fullwidth seceneginde kenar boslugu icin slider/banner kapsayicisinda `[&:not(.container_&)]:px-4` kullanilir. Böylece `container` modunda zaten padding olduğu için ekstra px verilmemiş olur.
- Panelden gelen gorsellerde sabit yukseklik verme (`h-*`, `min-h-*`); oran gorselin kendi boyutundan gelsin. İstisna olarak info-icon vb. gibi minik size-10 civarına kadar olan görsellere size-* h-* gibi değer verebilirsin çok büyük eklemelerde patlamaması için. 
- Cizimde karsiligi olmayan alanlari (or. `SUBTITLE`, vb yoksa ekstra ekleme) koddan kaldır. Sadece çizimde olan değerler kalsın. 

## Veri Kaynagi
- İhtiyaç olmazsa mevcut değişkenleri kullan. json örneğini incelemene gerek yok. 
- İhtiyaç halinde ise degisken listesi ve ornek payload icin: `references/section/variables/banner.json`
- SETTING. ile gelen verileri ihtiyaç halinde panelden ekleyebiliriz. Mesele SETTING.SECOND_LOGO ihtiyacı olursa bildirirsen panelden ekleriz. 
