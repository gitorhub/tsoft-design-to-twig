# Product Card Snippet Map (`snippets/product-list/product-card/*.twig`)

## Scope
- Mevcutta default ürün kartı olur. Sen iletilen tasarımı default ürün kartının üzerine giydireceksin. 
- Bu showcase (vitrin) ve ürün liste kartlarının tasarımı için kullanılır. Ürün kartları benzer ve tekrar eden aynı kartlar olduğu için sadece bir tanesini baz al.
- İki farklı ürün kartı varsa ikinci kartı hover durumundaki kart gibi değerlendir. Kapsayıcıdaki `group` classına göre `group-hover:` durumunu uygula. 

- Include/snippet path fallback mantigini bozma.

## Uygulama Notlari

- `data-*` attribute alanlarini silme, yeniden adlandirma.
- `t.*` ceviri anahtarlarini koru. Panelden isteyen içeriğini zaten değiştirir.
- Figma tasarimina gore sinif ve tasarım duzeyi degisiklik yap, ancak urun/fiyat/stok davranisini etkileyen Twig kosullarina dokunma.
- Eğer `Yeni` veya `İndirimli` gibi badge varsa tailwind ile style ver. Fakat haricen simgeler varsa (Hızlı kargo, Hediyeli ürün) veya ikonvari simgeler. Ürün simgelerinden geliyor demektir. Onları panelden resim olarak müşterinin girmesini bekle. Ama sanki panelden gelmiş gibi simge resmini konumlandır.
- Default olarak bulunan sepete ekle, favori ekle, karşılaştır hızlı gör gibi butonlar panelden ayara göre yönetildiği için tasarımda ürün kartında bu ikonlar olmazsa bile bunları silme. İsteyen panelden kapatır. Sen sadece tasarımda olanları düzenle. Tasarımda olmayan ikonları ise tasarımda olan ikonlar ile ile renk, ui, ux vb ile  uygumlu hale getir.
- out_of_stock  durumu çizilmemiş ise bile ihtiyaç varsa tasarıma uygun bir hale getir.
- border, shadow vb yoksa tasarımdan kaldır. Varsa daha önce dediğimiz gibi border-custom tarzı tailwindconfig dosyasında geçenleri kullan.
- P.NUMERIC1 (Sepette Ekstra indirim) alanı tasarımda yoksa bile, tasarımla uyumlu hale getir.
- Ürün kartları mobilde yan yana iki kart olacak şekilde bulunduğundan responsive tasarım önemlidir. Font sizelar pc e göre çok daha minimal olmalıdır.
- Fiyat alanları pratikte 6-7 haneli gibi uzun olabiliyor. Özellikle mobilde, fiyat bilgisini daha okunaklı yapmak için alt alta gelecek şekilde (ör. `flex-col` gibi sınıflar kullanarak) düzenleme yapabilirsin.
