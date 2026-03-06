# Html + css → Tailwind Skill Kuralları

- Aynı görünümü tailwind default classları ile birebir elde et (renkler, spacing, tipografi, layout). Yani text-[13px] gibi değerler yerine text-sm gibi kullan.
- Gereksiz class kullanma. Tailwind classları hariç class veya idleri alma. 
- data-\* attribute'lerini mevcut yapıda bırak. Sadece tasarımı buradaki gibi olsun.
- data-\* attribute'leri kullanarak Slider, accordion, tab gibi interaktif öğeler için kontrol et. JS yazmayacaksın.
- Responsive breakpoint'leri koru
- Döngüleri, değişkenleri vb. değerleri kullan.
- Sadece tasarımı yapacaksın. Tasarımdaki değişkenlerin panelden geldiğini kabul edeceksin. Resimler, url, datalar vb. 
- Menuden, bannerdan gelmeyen sabit link vermen gerekirse statik verme. sayfa numarasına göre link ver. Örneğin login sayfası için `href="{{ url(5,'page') }}"` gibi verebilirsin. Hangi sayfanın id numarası ne bilemezsen, `references/global/page-number.json` a bakabilirsin.
- Kodlamanı yaparken .twig dosyasının içindeki yapıyı sana atılan resim, html css vb e göre kodlamalısın. Tailwind haricinde olan classları idleri dahil etmemelisin. Alman gereken sadece ve sadece tasarım. Diğer tüm yapı .twig dosyasındaki yapı olmalı. Çalışma manıtğı bozulmamalı.
- `text-gray-700` gibi şeyler yerine `text-body/70` değerler kullanabilisin. 


## section/header'a özel durumlar

- Logo konumu vb değişirebilirsin ama kapsayıcıdaki max-h-* ayarlarını düzeltebilirsin.
- Mobil menu için snippet olarak dahil edildiği için `section/header` içinde mobil menuye dair bir şey yapılmaz.
- Eğer masaüstü açılır menu bilgisi verilmeişse default olanı bırak.
- Menüler panelden dinamik geliyor, sana iletilen çizimde veya kodda 2 menu varsa bile onu kısıtlama. Panelden kaç tane eklenmişse o gelsin.


