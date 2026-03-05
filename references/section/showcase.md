# Showcase (`section/showcase/*.twig`)

## Politika

- İlk tab, Twig ile render edildiği için doğrudan gelir; diğer tablar ise tıklama ile lazy olarak AJAX üzerinden yüklenir.
- Tab içindeki içerikler ajax ile yüklenirken `snippets/showcase/*.twig` baz alınır; bu dosyalarda yazılanlar yüklenir.
- `data-*` alanlarını koru.
- Tab butonları, tab resmi, tab resmi ile grid konumları vb. düzenlemeleri burada yap.

## Ilgili Referans

- Showcase (vitrin) ve product-list alanları aynı ürün kartını düzenler. Daha önce düzenleme yaptıysan ürün kartında tekrar düzenleme yapmana gerek yok. Ancak düzenleme yapmadıysan, ürün kartı tasarımı geldiğinde buna göre kontrol et.
- Kart içeriği: `references/snippets/product-card.md`
- Slider navigation ve slider pagination konumları için `snippets/showcase/*.twig` alanını düzenle. Pagination/navigation için genel düzenlemelerde `assets/css/theme.css` dosyasına bakman gerektiğini zaten biliyorsun.

## Veri Kaynagi

- İhtiyacın olmadığında değişkenleri inceleme. Sadece kullanacağın değişkeni mevcut şablonda bulamazsan ürün variables listesine bak.
- Değişken listesi ve örnek payload için: `references/section/variables/showcase.json`
