# Defter — Kişisel Blog

Next.js 16 ile yazılmış, mobil öncelikli, 3D animasyonlu bir kişisel blog. Yazılar şimdilik proje içindeki `data/posts.json` dosyasında tutuluyor; ileride bir veritabanına taşımak için tüm veri erişimi tek bir dosyada (`lib/posts.ts`) toplandı.

## Özellikler

- **Next.js 16 (App Router + Turbopack)** — sayfalar ve API aynı projede
- **3D animasyonlu hero** — react-three-fiber ile yapılmış, fareyle/dokunuşla hafif paralaks yapan kayan sayfa temalı bir sahne
- **Mobil öncelikli tasarım** — Tailwind CSS v4, özel tipografi (Fraunces + Inter + IBM Plex Mono)
- **Kullanıcı hesabı yok** — sadece senin şifrenle açılan bir `/admin` sayfası var, yazı ekleme/düzenleme/silme oradan yapılıyor
- **Dosya tabanlı veri** — `data/posts.json`, ileride veritabanına geçiş kolay olacak şekilde soyutlandı
- **Görsel yükleme** — admin panelinden kapak görseli yükleyip `public/uploads` altına kaydedebiliyorsun

## Kurulum

```bash
npm install
cp .env.example .env.local
```

`.env.local` dosyasını aç ve iki değeri değiştir:

```
ADMIN_PASSWORD=güçlü-bir-şifre-yaz
ADMIN_SECRET=rastgele-uzun-bir-metin-yaz
```

`ADMIN_PASSWORD` admin girişinde kullanacağın şifre. `ADMIN_SECRET` sadece çerezi imzalamak için kullanılan, kimseyle paylaşmayacağın rastgele bir metin — istediğin kadar uzun ve rastgele olsun.

## Çalıştırma

```bash
npm run dev
```

Tarayıcıda `http://localhost:3000` adresini aç. Yazıları yönetmek için `http://localhost:3000/admin/login` adresine gidip şifreni gir (ya da site altbilgisindeki küçük "yönet" bağlantısına tıkla).

## Production build

```bash
npm run build
npm run start
```

## Yazıları nasıl ekliyorsun

1. `/admin/login` üzerinden giriş yap
2. Açılan panelde başlık, kısa özet (boş bırakırsan içerikten otomatik üretilir), etiketler, isteğe bağlı bir kapak görseli ve içeriği (Markdown formatında) gir
3. "Önizle" ile yazının nasıl görüneceğini kontrol et
4. "Yayında" kutusunu işaretli bırakırsan yazı hemen sitede görünür; kapatırsan taslak olarak kalır
5. "Yayınla" / "Güncelle" butonuna bas

Sağdaki listeden var olan yazıları düzenleyebilir ya da silebilirsin.

## Veriyi ileride veritabanına taşımak

Tüm okuma/yazma işlemleri `lib/posts.ts` içindeki fonksiyonlardan geçiyor: `getAllPosts`, `getPostBySlug`, `createPost`, `updatePost`, `deletePost`. Bir veritabanına (Postgres, SQLite, MongoDB vb.) geçerken sadece bu dosyanın içini değiştirmen yeterli — API rotaları ve sayfalar bu fonksiyonları çağırdığı için başka hiçbir yeri değiştirmen gerekmiyor.

## Önemli not — sunucu/hosting seçimi

`data/posts.json` ve `public/uploads` dosyaya yazarak çalışıyor. Bu, kendi sunucunda (VPS, kendi bilgisayarın, Docker vb.) sorunsuz çalışır. Ama **Vercel gibi serverless ortamlarda dosya sistemi salt-okunur olduğu için** (ya da her istekte sıfırlandığı için) eklediğin yazılar kalıcı olmaz. Serverless bir yere deploy edecek olursan, önce "Veriyi ileride veritabanına taşımak" adımını yapman gerekir.

## Proje yapısı

```
app/
  page.tsx              → Ana sayfa (3D hero + yazı listesi)
  blog/[slug]/page.tsx  → Yazı detay sayfası
  admin/login/page.tsx  → Admin giriş ekranı
  admin/page.tsx        → Admin paneli (yazı ekle/düzenle/sil)
  api/posts/            → Yazı listeleme/oluşturma/güncelleme/silme
  api/auth/             → Giriş/çıkış
  api/upload/           → Kapak görseli yükleme
components/             → Nav, Footer, PostCard, Hero3D, MarkdownContent
lib/posts.ts            → Veri erişim katmanı (JSON dosyası okuma/yazma)
lib/postUtils.ts        → Client tarafında da kullanılabilen yardımcı fonksiyonlar
lib/auth.ts             → Şifre kontrolü ve çerez doğrulama
proxy.ts                → /admin ve API yazma uçlarını koruyan istek katmanı
data/posts.json         → Yazıların tutulduğu dosya
```
