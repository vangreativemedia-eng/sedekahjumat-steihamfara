# Infaq & Shadaqah Kampus

Situs statis (HTML, CSS, JavaScript). Tanpa build, tanpa server.

## Edit
1. Buka folder di VS Code.
2. `js/config.js`: nama kampus, WhatsApp, rekening, QRIS.
3. `js/data.js`: laporan dan penyaluran mingguan.
4. Letakkan gambar QRIS di `assets/`, lalu ubah `qrisImage`.
5. Preview: ekstensi Live Server, klik kanan `index.html` > Open with Live Server.

## Publikasi lewat GitHub Pages
1. Buat repository publik di GitHub, lalu dari terminal VS Code: `git init`, `git add .`, `git commit -m "Awal"`, `git branch -M main`, `git remote add origin <URL-repo>`, `git push -u origin main`.
2. Di GitHub: Settings > Pages > Source: Deploy from a branch > `main` / `/ (root)` > Save.
3. Situs aktif di `https://<username>.github.io/<nama-repo>/`. Buat QR dari link ini untuk poster.
