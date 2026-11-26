document.addEventListener("DOMContentLoaded", () => {
  // Hitung tanggal Jum'at terdekat untuk teks deadline
  const today = new Date();
  const day = today.getDay();
  const distance = (5 + 7 - day) % 7; 
  const jumatDate = new Date(today);
  jumatDate.setDate(today.getDate() + (distance === 0 ? 0 : distance));
  
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = jumatDate.toLocaleDateString('id-ID', options);
  
  const tutupEl = document.getElementById("tutup");
  if (tutupEl) {
    tutupEl.textContent = `Jum'at, ${formattedDate}`;
  }

  const yrEl = document.getElementById("yr");
  if (yrEl) {
    yrEl.textContent = today.getFullYear();
  }
});