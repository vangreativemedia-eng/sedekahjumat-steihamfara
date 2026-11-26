(function () {
  const C = window.SITE_CONFIG, $ = (s) => document.querySelector(s);
  const rp = (n) => "Rp " + new Intl.NumberFormat("id-ID").format(n);
  let nominal = 0, toastTimer;

  document.querySelectorAll("[data-bind]").forEach((el) => { if (C[el.dataset.bind]) el.textContent = C[el.dataset.bind]; });
  $("#yr").textContent = new Date().getFullYear();
  document.title = "Sedekah Jum'at Berkah " + C.kampus;

  // Jum'at pada pekan berjalan (pekan dimulai hari Ahad, otomatis berganti tiap Ahad)
  const d = new Date();
  d.setDate(d.getDate() - d.getDay() + 5);
  $("#tutup").textContent = d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" }).replace("Jumat", "Jum'at");

  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("on");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("on"), 2200);
  }
  function copy(text) {
    const done = () => toast("Tersalin");
    if (navigator.clipboard) return navigator.clipboard.writeText(text).then(done, done);
    const a = document.createElement("textarea"); a.value = text; document.body.appendChild(a);
    a.select(); document.execCommand("copy"); a.remove(); done();
  }

  // Nominal
  $("#chips").innerHTML = C.nominalCepat.map((n) =>
    `<label><input type="radio" name="nom" value="${n}"><span>${rp(n)}</span></label>`).join("");
  document.querySelectorAll("input[name=nom]").forEach((r) => r.addEventListener("change", () => {
    nominal = +r.value; $("#custom").value = ""; update();
  }));
  $("#custom").addEventListener("input", (e) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, 9);
    nominal = +v || 0;
    e.target.value = v ? new Intl.NumberFormat("id-ID").format(v) : "";
    document.querySelectorAll("input[name=nom]").forEach((r) => (r.checked = false));
    update();
  });
  ["#nama", "#anonim"].forEach((s) => $(s).addEventListener("input", update));

  // Metode bayar
  if (C.qrisImage) { $("#qris").src = C.qrisImage; $("#qris-dl").href = C.qrisImage; }
  else { // tanpa QRIS: tampilkan transfer bank saja
    $("#t-qris").hidden = $("#p-qris").hidden = true; $("#p-bank").hidden = false;
    $("#t-bank").setAttribute("aria-selected", true); $(".tabs").style.gridTemplateColumns = "1fr";
  }
  $("#p-bank").innerHTML = C.rekening.map((r, i) =>
    `<div class="bank"><small>${r.bank}</small><b>${r.nomor}</b><small>a.n. ${r.atasNama}</small>
     <button class="btn ghost" data-copy="${i}">Salin nomor rekening</button></div>`).join("") +
    `<button class="btn ghost" id="copy-nom" type="button">Salin nominal</button>`;
  document.querySelectorAll("[data-copy]").forEach((b) => b.addEventListener("click", () => copy(C.rekening[b.dataset.copy].nomor)));
  $("#copy-nom").addEventListener("click", () => (nominal ? copy(String(nominal)) : toast("Pilih nominal dulu")));
  document.querySelectorAll("[role=tab]").forEach((t) => t.addEventListener("click", () => {
    document.querySelectorAll("[role=tab]").forEach((x) => {
      const on = x === t; x.setAttribute("aria-selected", on);
      $("#" + x.getAttribute("aria-controls")).hidden = !on;
    });
  }));

  // Konfirmasi
  function update() {
    const jenis = "Sedekah Jum'at";
    const nama = $("#anonim").checked || !$("#nama").value.trim() ? "Hamba Allah" : $("#nama").value.trim();
    const ok = nominal >= C.nominalMinimal;
    $("#err").hidden = true;
    $("#copy-nom").textContent = nominal ? "Salin nominal (" + rp(nominal) + ")" : "Salin nominal";
    $("#ringkas").textContent = nominal ? `${jenis} ${rp(nominal)} atas nama ${nama}` : "Pilih nominal untuk melanjutkan.";
    const msg = `Assalamualaikum, saya ingin konfirmasi ${jenis} sebesar ${rp(nominal)} atas nama ${nama}. Bukti transfer saya lampirkan di chat ini. Terima kasih.`;
    const wa = $("#wa");
    wa.href = `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(msg)}`;
    wa.setAttribute("aria-disabled", !ok);
    wa.target = "_blank"; wa.rel = "noopener";
  }
  $("#wa").addEventListener("click", (e) => {
    if (nominal < C.nominalMinimal) {
      e.preventDefault();
      const er = $("#err"); er.hidden = false;
      er.textContent = `Pilih nominal terlebih dahulu. Minimal ${rp(C.nominalMinimal)}.`;
    }
  });
  if (C.googleFormUrl) { const g = $("#gform"); g.href = C.googleFormUrl; g.hidden = false; }
  update();

  // Narahubung dan bagikan
  const n = C.whatsapp;
  $("#cp-num").textContent = n.length === 13 ? `+${n.slice(0, 2)} ${n.slice(2, 5)}-${n.slice(5, 9)}-${n.slice(9)}` : "+" + n;
  $("#cp-wa").href = `https://wa.me/${n}?text=` + encodeURIComponent("Assalamualaikum, saya ingin bertanya tentang Sedekah Jum'at Berkah.");
  $("#share").addEventListener("click", async () => {
    const url = location.href.split("#")[0];
    const text = "Yuk ikut Sedekah Jum'at Berkah STEI Hamfara. Mulai Rp 10.000, insya Allah untuk konsumsi Jum'at bersih dan makan siang jamaah sholat Jum'at.";
    if (navigator.share) { try { await navigator.share({ title: document.title, text, url }); } catch (e) {} return; }
    window.open("https://wa.me/?text=" + encodeURIComponent(text + " " + url), "_blank", "noopener");
  });
})();
