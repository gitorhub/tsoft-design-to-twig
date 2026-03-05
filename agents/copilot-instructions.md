# TSOFT Tailwind Twig Section

TSOFT OS2 projelerinde Figma veya HTML/CSS tasarımlarını Twig şablonlarına dönüştürürken tema bütünlüğünü (theme.css değişkenleri, hazır global componentler) koruyarak Tailwind tabanlı ve responsive temiz kodlama yap.

When working with `.twig` files, templates, sections, or snippets:
Keyfi özel değerler yerine en yakın Tailwind sınıflarını (text-[13px] -> text-xs), arbitrary renkler yerine semantik classları (bg-primary, text-body vb.) kullan. Üzerinde çalıştığın dosya yoluna uygun reference (references/*) dokümanını baz al. HTML içindeki 'data-*' attributelerini, macro/snippet yapılarını, sr-only gibi erişilebilirlik etiketlerini koru. Varsayılan UI kırılımı olarak sadece 'lg' breakpoint'ini esas al. Kod kalabalığından kaçın ve yorum satırı ekleme.
