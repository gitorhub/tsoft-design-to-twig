# Blog Recent Post (`section/blog-recent-post/*.twig`)

## Politika

- Tüm bilgiler panelden gelir.
- Gorsel fallback: `IMG1` yoksa `IMG2`gösterilir.
- Tasarıma göre resimlere en/boy oranı `aspect-[4/3]`, `aspect-square` vb. verilir. Çünkü panelden girilen resimler farklı olabiliyor. Görünümün tasarımdaki gibi olması gerekiyor. 
- Görünüm slider ise `data-toggle="slider"`, `data-swiper` gibi dataset alanlarini koru.
- Sadece tasarimda aktif alanlari yaz, gereksiz payload tasima. Mesela blog kategorileri çizimde yoksa koddan kaldır.
- Görünüm ayarlarını, perview margin responsive olarak çizime göre ayarla. **Çizimde kaç kart yan yana:** Sadece değişen breakpoint'leri yaz; aynı değeri tekrar etme (sm yazmazsan xs alır). Örn. mobilde 2(peek), masaüstünde 3 kart → `data-perview="xs:2,lg:3"` ve `width(SETTING.PERVIEW, {xs: 2, lg: 3})`.

## Tarih Badge için (PUBLISHED_AT) kullan
- Tarih olarak normal durumlarda `PUBLISHED_AT` kullan.
- Ay (Month) değeri yazı olduğunda (Ekim, Kasım, January, vb.) `t[LIST.PUBLISHED_AT|date("F")|lower] ?? LIST.PUBLISHED_AT|date("F")` ile dil karşılığı kullan;

## Veri Kaynagi

- İlk olarak mevcut verileri kullan .json referanslarına bakma. Fakat bir şekilde ihtiyaç olursa bak.
- Degisken listesi ve ornek payload icin: `references/section/variables/blog-recent-post.json`
