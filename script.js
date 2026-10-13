// GANTI DENGAN URL DEPLOYMENT GOOGLE APPS SCRIPT
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyDe6SR4AfVakZSXhCtndL8mSm8p_6JKKLJKLx70T_L4dtbhareKfxfYNKid3MkWS02/exec";

let currentGuru = null;
let currentSiswaData = [];

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  
  const bgClass = type === "success" ? "bg-emerald-600" : type === "error" ? "bg-rose-600" : "bg-blue-600";
  toast.className = `pointer-events-auto ${bgClass} text-white px-4 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 transform transition-all duration-300 translate-y-[-10px] opacity-0`;
  toast.innerHTML = `<span>${type === "success" ? "✓" : "⚠️"}</span><span>${message}</span>`;
  
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.remove("translate-y-[-10px]", "opacity-0");
  }, 10);

  setTimeout(() => {
    toast.classList.add("opacity-0");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function switchAuth(type) {
  const tabLogin = document.getElementById("tab-login");
  const tabReg = document.getElementById("tab-register");
  const formLogin = document.getElementById("form-login");
  const formReg = document.getElementById("form-register");

  if (type === "login") {
    tabLogin.className = "py-2.5 rounded-xl transition-all text-blue-700 bg-white shadow-sm";
    tabReg.className = "py-2.5 rounded-xl transition-all text-slate-500 hover:text-slate-700";
    formLogin.classList.remove("hidden");
    formReg.classList.add("hidden");
  } else {
    tabReg.className = "py-2.5 rounded-xl transition-all text-teal-700 bg-white shadow-sm";
    tabLogin.className = "py-2.5 rounded-xl transition-all text-slate-500 hover:text-slate-700";
    formReg.classList.remove("hidden");
    formLogin.classList.add("hidden");
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const btn = document.getElementById("btn-login");

  btn.disabled = true;
  btn.innerText = "Memverifikasi...";

  try {
    const res = await fetch(`${SCRIPT_URL}?action=login&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
    const data = await res.json();

    if (data.status === "success") {
      currentGuru = data;
      showToast(`Selamat datang, ${data.namaGuru}!`, "success");
      
      document.getElementById("auth-section").classList.add("hidden");
      document.getElementById("main-navbar").classList.remove("hidden");
      document.getElementById("nama-guru").innerText = data.namaGuru;

      populateMapelSelect(data.mapelList);
      switchNav("absensi");

      const today = new Date().toISOString().split("T")[0];
      document.getElementById("tanggal").value = today;
      document.getElementById("rekap-bulan").value = today.slice(0, 7);
    } else {
      showToast(data.message || "Email atau password salah!", "error");
    }
  } catch (err) {
    showToast("Gagal terhubung ke server!", "error");
  } finally {
    btn.disabled = false;
    btn.innerText = "Masuk ke Sistem";
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const kodeGuru = document.getElementById("reg-kodeguru").value.trim();
  const nama = document.getElementById("reg-nama").value.trim();
  const mapel = document.getElementById("reg-mapel").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value.trim();
  const btn = document.getElementById("btn-register");

  btn.disabled = true;
  btn.innerText = "Mendaftarkan...";

  try {
    const url = `${SCRIPT_URL}?action=register&kodeGuru=${encodeURIComponent(kodeGuru)}&nama=${encodeURIComponent(nama)}&mapel=${encodeURIComponent(mapel)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status === "success") {
      showToast("Pendaftaran berhasil! Silakan login.", "success");
      switchAuth("login");
    } else {
      showToast(data.message || "Gagal mendaftar!", "error");
    }
  } catch (err) {
    showToast("Gagal mendaftar akun baru!", "error");
  } finally {
    btn.disabled = false;
    btn.innerText = "Daftar Akun Baru";
  }
}

function populateMapelSelect(list) {
  const selAbsensi = document.getElementById("select-mapel");
  const selRekap = document.getElementById("rekap-mapel");
  
  selAbsensi.innerHTML = "";
  selRekap.innerHTML = "";

  list.forEach(m => {
    selAbsensi.add(new Option(m, m));
    selRekap.add(new Option(m, m));
  });
}

function switchNav(nav) {
  const btnAbs = document.getElementById("nav-absensi");
  const btnRek = document.getElementById("nav-rekap");
  const secAbs = document.getElementById("absensi-section");
  const secRek = document.getElementById("rekap-section");

  if (nav === "absensi") {
    btnAbs.className = "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 text-white shadow transition flex items-center gap-2";
    btnRek.className = "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition flex items-center gap-2";
    secAbs.classList.remove("hidden");
    secRek.classList.add("hidden");
  } else {
    btnRek.className = "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 text-white shadow transition flex items-center gap-2";
    btnAbs.className = "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition flex items-center gap-2";
    secRek.classList.remove("hidden");
    secAbs.classList.add("hidden");
  }
}

function pilihTingkatan(tingkat) {
  document.querySelectorAll(".btn-tingkatan").forEach(b => {
    b.className = "btn-tingkatan py-2.5 rounded-xl font-bold text-sm bg-white border border-slate-300 text-slate-700 hover:bg-blue-50 transition";
  });
  document.getElementById(`btn-tingkatan-${tingkat}`).className = "btn-tingkatan py-2.5 rounded-xl font-bold text-sm bg-blue-600 text-white shadow-md transition";

  const grid = document.getElementById("grid-abjad");
  grid.innerHTML = "";
  const abjad = ["A", "B", "C", "D", "E", "F", "G", "H"];

  abjad.forEach(a => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "py-2 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 transition";
    btn.innerText = `${tingkat}${a}`;
    btn.onclick = () => pilihKelasFull(`${tingkat}${a}`, btn);
    grid.appendChild(btn);
  });

  document.getElementById("subkelas-container").classList.remove("hidden");
  document.getElementById("daftar-siswa-container").classList.add("hidden");
}

function pilihKelasFull(kelas, btnEl) {
  document.querySelectorAll("#grid-abjad button").forEach(b => {
    b.className = "py-2 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 transition";
  });
  btnEl.className = "py-2 rounded-lg text-xs font-bold bg-blue-700 text-white shadow-md transition";
  document.getElementById("kelas").value = kelas;

  loadSiswa(kelas);
}

async function loadSiswa(kelas) {
  const container = document.getElementById("daftar-siswa-container");
  const tbody = document.getElementById("tabel-siswa");
  
  tbody.innerHTML = `<tr><td colspan="3" class="text-center py-8 text-xs font-bold text-slate-500">Memuat data siswa kelas ${kelas}...</td></tr>`;
  container.classList.remove("hidden");

  try {
    const res = await fetch(`${SCRIPT_URL}?action=getSiswa&kelas=${encodeURIComponent(kelas)}`);
    const data = await res.json();

    if (data && data.length > 0) {
      currentSiswaData = data.map(s => ({ ...s, status: "H" }));
      renderTabelSiswa(currentSiswaData);
    } else {
      tbody.innerHTML = `<tr><td colspan="3" class="text-center py-8 text-xs font-bold text-rose-500">Siswa untuk kelas ${kelas} tidak ditemukan di Sheet Master Admin!</td></tr>`;
    }
  } catch (err) {
    showToast("Gagal mengambil daftar siswa!", "error");
  }
}

function renderTabelSiswa(dataList) {
  const tbody = document.getElementById("tabel-siswa");
  tbody.innerHTML = "";

  document.getElementById("total-siswa-badge").innerText = `${dataList.length} Siswa`;

  dataList.forEach((s, idx) => {
    const tr = document.createElement("tr");
    tr.className = "hover:bg-slate-50 transition";
    
    tr.innerHTML = `
      <td class="p-3.5 text-center font-bold text-slate-500">${idx + 1}</td>
      <td class="p-3.5 font-bold text-slate-800">${s.nama}</td>
      <td class="p-3.5 text-center">
        <div class="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 gap-1">
          <button type="button" onclick="setStatus(${idx}, 'H')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition ${s.status === 'H' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}">H</button>
          <button type="button" onclick="setStatus(${idx}, 'S')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition ${s.status === 'S' ? 'bg-amber-500 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}">S</button>
          <button type="button" onclick="setStatus(${idx}, 'I')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition ${s.status === 'I' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}">I</button>
          <button type="button" onclick="setStatus(${idx}, 'A')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition ${s.status === 'A' ? 'bg-rose-600 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}">A</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function setStatus(index, st) {
  currentSiswaData[index].status = st;
  renderTabelSiswa(currentSiswaData);
}

function setSemuaStatus(st) {
  currentSiswaData.forEach(s => s.status = st);
  renderTabelSiswa(currentSiswaData);
  if(st === 'H') showToast("Semua siswa diatur Hadir!", "success");
}

function filterSiswa() {
  const query = document.getElementById("search-siswa").value.toLowerCase();
  const filtered = currentSiswaData.filter(s => s.nama.toLowerCase().includes(query));
  renderTabelSiswa(filtered);
}

// KIRIM ABSENSI BESERTA DATA JURNAL HARIAN
async function kirimAbsensi() {
  const mapel = document.getElementById("select-mapel").value;
  const tanggal = document.getElementById("tanggal").value;
  const kelas = document.getElementById("kelas").value;
  const materi = document.getElementById("jurnal-materi").value.trim();
  const catatan = document.getElementById("jurnal-catatan").value.trim();
  const btn = document.getElementById("btn-kirim");

  if (!tanggal || !kelas) {
    showToast("Lengkapi tanggal dan kelas terlebih dahulu!", "error");
    return;
  }

  btn.disabled = true;
  btn.innerText = "Menyimpan Presensi & Jurnal...";

  const payload = {
    spreadsheetIdGuru: currentGuru.spreadsheetIdGuru,
    mapel: mapel,
    tanggal: tanggal,
    kelas: kelas,
    materi: materi,
    catatan: catatan,
    absensiData: currentSiswaData
  };

  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.status === "success") {
      showToast("Presensi & Jurnal Harian berhasil disimpan!", "success");
      document.getElementById("jurnal-materi").value = "";
      document.getElementById("jurnal-catatan").value = "";
    } else {
      showToast(data.message || "Gagal menyimpan absensi!", "error");
    }
  } catch (err) {
    showToast("Gagal mengirim data!", "error");
  } finally {
    btn.disabled = false;
    btn.innerText = "Simpan Presensi & Jurnal ke Sheets";
  }
}

function pilihTingkatanRekap(tingkat) {
  document.querySelectorAll(".btn-rekap-tingkatan").forEach(b => {
    b.className = "btn-rekap-tingkatan py-2.5 rounded-xl font-bold text-sm bg-white border border-slate-300 text-slate-700 hover:bg-blue-50 transition";
  });
  document.getElementById(`btn-rekap-tingkatan-${tingkat}`).className = "btn-rekap-tingkatan py-2.5 rounded-xl font-bold text-sm bg-blue-600 text-white shadow-md transition";

  const grid = document.getElementById("rekap-grid-abjad");
  grid.innerHTML = "";
  const abjad = ["A", "B", "C", "D", "E", "F", "G", "H"];

  abjad.forEach(a => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "py-2 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 transition";
    btn.innerText = `${tingkat}${a}`;
    btn.onclick = () => pilihKelasRekapFull(`${tingkat}${a}`, btn);
    grid.appendChild(btn);
  });

  document.getElementById("rekap-subkelas-container").classList.remove("hidden");
}

function pilihKelasRekapFull(kelas, btnEl) {
  document.querySelectorAll("#rekap-grid-abjad button").forEach(b => {
    b.className = "py-2 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 transition";
  });
  btnEl.className = "py-2 rounded-lg text-xs font-bold bg-blue-700 text-white shadow-md transition";
  document.getElementById("rekap-kelas").value = kelas;
}

let lastRekapData = [];

async function loadRekapBulanan() {
  const mapel = document.getElementById("rekap-mapel").value;
  const bulanTahun = document.getElementById("rekap-bulan").value;
  const kelas = document.getElementById("rekap-kelas").value;
  const btn = document.getElementById("btn-load-rekap");
  const container = document.getElementById("rekap-tabel-container");

  if (!bulanTahun || !kelas) {
    showToast("Pilih kelas dan bulan terlebih dahulu!", "error");
    return;
  }

  btn.disabled = true;
  btn.innerText = "Memuat data rekap...";

  try {
    const url = `${SCRIPT_URL}?action=getRekapBulanan&spreadsheetIdGuru=${currentGuru.spreadsheetIdGuru}&kelas=${encodeURIComponent(kelas)}&mapel=${encodeURIComponent(mapel)}&bulanTahun=${encodeURIComponent(bulanTahun)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status === "success") {
      lastRekapData = data.siswa;
      renderRekapTabel(data.siswa);
      container.classList.remove("hidden");
      showToast("Data rekap berhasil dimuat!", "success");
    } else {
      showToast(data.message || "Data rekap kosong!", "info");
      container.classList.add("hidden");
    }
  } catch (err) {
    showToast("Gagal memuat rekap bulanan!", "error");
  } finally {
    btn.disabled = false;
    btn.innerText = "Tampilkan Data Rekap Bulanan";
  }
}

function renderRekapTabel(list) {
  const thead = document.getElementById("rekap-thead");
  const tbody = document.getElementById("rekap-tbody");

  thead.innerHTML = `
    <tr>
      <th class="p-3 text-center w-12">No</th>
      <th class="p-3 w-28">NIS</th>
      <th class="p-3">Nama Siswa</th>
      <th class="p-3 text-center bg-emerald-700">Total H</th>
      <th class="p-3 text-center bg-amber-600">Total S</th>
      <th class="p-3 text-center bg-blue-700">Total I</th>
      <th class="p-3 text-center bg-rose-700">Total A</th>
    </tr>
  `;

  tbody.innerHTML = "";
  list.forEach(s => {
    const tr = document.createElement("tr");
    tr.className = "hover:bg-slate-50 transition border-b border-slate-100 font-medium";
    tr.innerHTML = `
      <td class="p-3 text-center font-bold text-slate-500">${s.no}</td>
      <td class="p-3 text-slate-600">${s.nomorInduk || "-"}</td>
      <td class="p-3 font-bold text-slate-800">${s.nama}</td>
      <td class="p-3 text-center font-bold text-emerald-600 bg-emerald-50/50">${s.totalH}</td>
      <td class="p-3 text-center font-bold text-amber-600 bg-amber-50/50">${s.totalS}</td>
      <td class="p-3 text-center font-bold text-blue-600 bg-blue-50/50">${s.totalI}</td>
      <td class="p-3 text-center font-bold text-rose-600 bg-rose-50/50">${s.totalA}</td>
    `;
    tbody.appendChild(tr);
  });
}

function exportToExcel() {
  if (!lastRekapData || lastRekapData.length === 0) return;
  
  const kelas = document.getElementById("rekap-kelas").value;
  const mapel = document.getElementById("rekap-mapel").value;
  const bulan = document.getElementById("rekap-bulan").value;

  const dataExcel = lastRekapData.map(s => ({
    "NO": s.no,
    "NIS": s.nomorInduk || "",
    "NAMA SISWA": s.nama,
    "TOTAL H": s.totalH,
    "TOTAL S": s.totalS,
    "TOTAL I": s.totalI,
    "TOTAL A": s.totalA
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataExcel);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Kelas ${kelas}`);

  XLSX.writeFile(workbook, `Rekap_Absensi_${kelas}_${mapel}_${bulan}.xlsx`);
  showToast("File Excel berhasil diunduh!", "success");
}

function exportToPDF() {
  if (!lastRekapData || lastRekapData.length === 0) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const kelas = document.getElementById("rekap-kelas").value;
  const mapel = document.getElementById("rekap-mapel").value;
  const bulan = document.getElementById("rekap-bulan").value;

  doc.setFontSize(14);
  doc.text(`LAPORAN REKAP PRESENSI - SMP NEGERI 5 KLATEN`, 14, 15);
  doc.setFontSize(10);
  doc.text(`Mata Pelajaran: ${mapel} | Kelas: ${kelas} | Periode: ${bulan}`, 14, 22);

  const tableRows = lastRekapData.map(s => [
    s.no, s.nomorInduk || "-", s.nama, s.totalH, s.totalS, s.totalI, s.totalA
  ]);

  doc.autoTable({
    startY: 28,
    head: [["NO", "NIS", "NAMA SISWA", "TOTAL H", "TOTAL S", "TOTAL I", "TOTAL A"]],
    body: tableRows,
    theme: "grid",
    headStyles: { fillColor: [0, 32, 96] }
  });

  doc.save(`Rekap_Absensi_${kelas}_${mapel}_${bulan}.pdf`);
  showToast("File PDF berhasil diunduh!", "success");
}

function bukaModalMapel() {
  document.getElementById("modal-mapel").classList.remove("hidden");
}

function tutupModalMapel() {
  document.getElementById("modal-mapel").classList.add("hidden");
}

async function simpanMapelBaru() {
  const mapelBaru = document.getElementById("input-mapel-baru").value.trim();
  const btn = document.getElementById("btn-simpan-mapel");

  if (!mapelBaru) {
    showToast("Isi nama mata pelajaran baru!", "error");
    return;
  }

  btn.disabled = true;
  btn.innerText = "Menyimpan...";

  try {
    const url = `${SCRIPT_URL}?action=tambahMapel&email=${encodeURIComponent(currentGuru.emailGuru)}&mapelBaru=${encodeURIComponent(mapelBaru)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status === "success") {
      populateMapelSelect(data.mapelList);
      showToast("Mata pelajaran baru berhasil ditambahkan!", "success");
      tutupModalMapel();
      document.getElementById("input-mapel-baru").value = "";
    } else {
      showToast(data.message || "Gagal menambah mapel!", "error");
    }
  } catch (err) {
    showToast("Gagal menyimpan mapel baru!", "error");
  } finally {
    btn.disabled = false;
    btn.innerText = "Simpan Mapel";
  }
}

function logout() {
  location.reload();
}