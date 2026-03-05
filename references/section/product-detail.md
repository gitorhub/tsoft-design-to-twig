# Product Detail (`section/product-detail/*.twig`)

## Politika

- En önemli görevin tasarımı tam benzetmen. font size, spacign değerleri, konumları, border vb. Çalışma prensibini bozmaman. 
- Varyant/fiyat/stok akisini bozan dataset `data-*` kurallarını koru.
- Gorsel, varyant ve kampanya alanlarini kosullu kullan.
- BRAND_IMAGE eğer tasarımda yoksa kodlardan sil.
- Görünümü tailwind ile tasarımdaki gibi yap. Fakat hazır bir şablon içinde kodlama yaptığın için ve bir çok alan panelden yönetildiği için tasarımda olmayan her alanı da silme.
- Kodlarda olan ama tasarımda olmayan alanları, tasarım çizgisine göre yorumla ve kodla. Konumlarını değiştirip aşağılara al. Simge işaretlerinden sonra uygun bir yere al. Böylece hem çizimde olmayan alanlardan kaldırmış olursun hem de özellikleri kaybetmemiş altta bir div içinde toplamış olursun.
- Yeni bir alan kodlaman gerektiğinde ve ihtiyaç anında mevcut yapıdaki vat, format vb gibi özel fonksiyonları kullanabilirsin.
- İkonları çekemezsen lucide.com sitesinden uygun ikonu inline olarak dahil edebilirsin.
- Ürün detay sayfasında gelen tüm veriler bir şekilde ürün içerisinden payloaddan gelmektedir. Ürün bilgileri, ürün ek bilgi alanları. Statik bir şey eklenmez.
- Snippet include yollarinda `SETTING.SUBFOLDER_*` fallback uygularken çizime uygun hangi snippet var ise default olarak onu çağır. Mesela resim alanında vertical thumb olan bir slider varsa `product-detail.images.default` yerine `product-detail.images.vertical` kullan. Snippetlardan da uygun olan snippetta düzenleme yap.
- Eğer snippet içinde ilgili dosya yoksa demek ki default şablondan çekecek demektir. Yeni bir şablon oluşturma.
- P.NUMERIC1'den yüzde değeri girmelerini bekliyoruz. 10, 25, 50 gibi. Ona göre sepette extra indirimi gösteriyoruz. Bilgilen.

## snippets/product-detail/feature

- snippets/product-detail/feature/\*.twig şablonu var ise sadece uygun olan şablonda işlem yap. Bu şablon yok ise işlem yapmana gerek yok.
- accordion.twig ve drawer.twig genelde çizimde sepete ekle butonunun altında kullanılıyor.
- Accordion olan şablonlarda tabların bir tanesi genelde açık ve kendi içinde scroll halde çizilir. Diğerleri kapalı olur.
- Drawer olan şablonlarda ise tasarımında sadece başlıklar olur. Açık olan bir tab olmaz. Bazen drawer açık halleri de çizilebilir.
- tab.twig ise çoğunlukla en atta kullanılır. Default olarak kullanılan budur.
- section/product-detail şablonunda doğru fallback verdiğinden emin ol. `SETTING.SUBFOLDER_*` için tasarıma göre uygun fallback doğru verilmedi ise düzelt.
- Çizimde altta yatay sekme satırı + içerik paneli varsa doğrudan `feature/tab.twig` üzerinde çalış; sadece `section/product-detail/default.twig` düzenlemek yeterli değildir.
- Tab çizimlerinde aktif/pasif durum, sekme aralığı, içerik panel zemini ve içerik tipografisini vb. birlikte düzenle.

## snippets/product-detail/images

- Tasarımda slider var ve thumbnail altta ise genelde default.twig dir. slider ve thumbnail yanda ise vertical.twig dir. tekli ikili ya da başka türlü grid ile tüm resimler aynı anda gösteriliyorsa grid.twigtir.
- Thumbnail kaç tane görünmesi gerekiyorsa tasarıma uygun hale getir.
- section/product-detail şablonunda doğru fallback verdiğinden emin ol. `SETTING.SUBFOLDER_*` için tasarıma göre uygun fallback doğru verilmedi ise düzelt.

## snippets/product-detail/related

- Tasarıma göre button.twig, color.twig, defult.twig(product-picture), select.twig hangisi ise onda işlem yap. Diğerlerini sil.
- default.twigde aspect-product koru ve width responsive olarak çizime göre düzenle. color.twig i ise çizime göre en boy boşluk vb aynen uygula. Diğer alanlar zaten panelden geliyor. button.twig yüksekliği çizime göre uygula genişliği içeriğe göre değişir.
- section/product-detail şablonunda doğru fallback verdiğinden emin ol. `SETTING.SUBFOLDER_*` için tasarıma göre uygun fallback doğru verilmedi ise düzelt.
- Mesela Çizimde görsel thumbnail seçenekleri varsa `related/default.twig` kullan ve bu dosyayı düzenle; `color/button/select` üzerinde kalma.

## snippets/product-detail/variant-1

- Tasarıma göre button.twig, color.twig (color or variant group picture) , defult.twig(product-picture), select.twig hangisi ise onda işlem yap. Diğerlerini sil.
- default.twigde aspect-product koru ve width responsive olarak çizime göre düzenle. color.twig i ise çizime göre en boy boşluk vb aynen uygula. Diğer alanlar zaten panelden geliyor. button.twig yüksekliği çizime göre uygula genişliği içeriğe göre değişir.
- Mesela çizimde varyantlar ürün görseli thumbnail olarak geliyorsa `variant-1/default.twig` üzerinde çalış; görsel seçiciyi `color/button/select`e çevirmeye çalışma.

## snippets/product-detail/variant-2

- Tasarıma göre default.twig (button gibi), select.twig hangisi ise onda işlem yap. Diğerlerini sil.
- default.twig yüksekliği çizime göre uygula genişliği içeriğe göre değişir.
- `variant-2` çizimde text chip ise `default.twig`, dropdown görünüyorsa `select.twig` kullan; section fallbackini buna göre doğrula.

## Veri Kaynagi

- Mevcut şablonlardaki değişkenler senin için yeterli.

- Degisken listesi ve ornek payload icin: `references/section/variables/product-detail.json`
