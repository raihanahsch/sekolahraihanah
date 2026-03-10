var GA_DATA = {"admin": {"pass": "Raihanah2024", "name": "Admin Sekolah", "mapel": []}, "ustadz.syaifullah": {"pass": "syaif2024", "name": "Ust. Syaifullah Maslul, Lc., MA", "mapel": ["B. Arab", "Mustolah Hadits", "Faroidh", "Khat", "Balaghoh", "Nahwu", "Shorof", "Ushul Fiqih"]}, "ustadz.ridwan": {"pass": "ridwan2024", "name": "Ust. Ridwan Nashiruddin, SE.", "mapel": ["Hiwar", "B. Arab", "Aqidah", "Shorof", "Nahwu", "Hadits"]}, "ustadz.muthy": {"pass": "muthy2024", "name": "Ust. Muthy Abdullah, S.Pd.", "mapel": ["Fiqih", "Adab", "Imla", "Ushul Tafsir", "Siroh", "Aqidah", "Khitobah"]}, "kak.fifah": {"pass": "fifah2024", "name": "Kak Fifah", "mapel": ["Tahsin", "Dzikir dan Doa"]}, "kak.maryam": {"pass": "maryam2024", "name": "Kak Maryam Fauziyyah", "mapel": ["Tahfidz", "Hadits", "Tasmi", "Khitobah"]}, "kak.zainab": {"pass": "zainab2024", "name": "Kak Zainab", "mapel": ["Tahfidz", "Tahfidz Hadits", "Khitobah"]}, "kak.luna": {"pass": "luna2024", "name": "Kak Luna Mahda Alya", "mapel": ["Aqidah", "Siroh", "Khitobah"]}};
var GA_ICONS = {
  "admin": "Admin",
  "ustadz.syaifullah": "Ust.",
  "ustadz.ridwan": "Ust.",
  "ustadz.muthy": "Ust.",
  "kak.fifah": "Kak",
  "kak.maryam": "Kak",
  "kak.zainab": "Kak",
  "kak.luna": "Kak"
};
var CU = null;

function gLogin() {
  var u = document.getElementById("gu").value.trim();
  var p = document.getElementById("gpw").value.trim();
  if (GA_DATA[u] && GA_DATA[u].pass === p) {
    CU = u;
    document.getElementById("lform").style.display = "none";
    document.getElementById("gpanel").style.display = "block";
    document.getElementById("gname").textContent = GA_DATA[u].name;
    var mp = GA_DATA[u].mapel;
    document.getElementById("gmapel").textContent = mp.length ? mp.join(", ") : "Administrator";
    sessionStorage.setItem("guru_u", u);
    document.getElementById("gerr").classList.remove("show");
  } else {
    document.getElementById("gerr").classList.add("show");
  }
}

function gLogout() {
  CU = null;
  sessionStorage.removeItem("guru_u");
  document.getElementById("lform").style.display = "block";
  document.getElementById("gpanel").style.display = "none";
  document.getElementById("gpw").value = "";
  document.getElementById("gu").value = "";
}

function gTab(n, btn) {
  document.querySelectorAll(".gtb").forEach(function(b) { b.classList.remove("act"); });
  document.querySelectorAll(".gpn").forEach(function(p) { p.classList.remove("act"); });
  btn.classList.add("act");
  document.getElementById("gp-" + n).classList.add("act");
  if (n === "my") renderMy();
}

function gP() {
  try { return JSON.parse(localStorage.getItem("sr_posts") || "[]"); } catch(e) { return []; }
}
function sP(posts) { localStorage.setItem("sr_posts", JSON.stringify(posts)); }

function submitPost(t) {
  if (!CU) return;
  var body = "", title = "";
  if (t === "ann") {
    title = document.getElementById("ann-title").value.trim();
    body = document.getElementById("ann-body").value.trim();
    if (!body) { alert("Isi tidak boleh kosong!"); return; }
  } else {
    body = document.getElementById("msg-body").value.trim();
    if (!body) { alert("Isi tidak boleh kosong!"); return; }
  }
  var posts = gP();
  posts.push({ id: String(Date.now()), type: t, author: GA_DATA[CU].name, authorKey: CU, title: title, body: body, ts: Date.now() });
  sP(posts);
  if (t === "ann") {
    document.getElementById("ann-title").value = "";
    document.getElementById("ann-body").value = "";
  } else {
    document.getElementById("msg-body").value = "";
  }
  var ok = document.getElementById("ok-" + t);
  ok.style.display = "block";
  setTimeout(function() { ok.style.display = "none"; }, 4000);
}

function delPost(id) {
  if (!confirm("Hapus postingan ini?")) return;
  sP(gP().filter(function(p) { return p.id !== id; }));
  renderMy();
}

function renderMy() {
  if (!CU) return;
  var posts = gP().filter(function(p) { return p.authorKey === CU; });
  var el = document.getElementById("mpl");
  if (!el) return;
  if (!posts.length) { el.innerHTML = "<div class=\"nop\">Belum ada postingan.</div>"; return; }
  var mn = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  el.innerHTML = posts.slice().sort(function(a, b) { return b.ts - a.ts; }).map(function(p) {
    var d = new Date(p.ts);
    var ds = d.getDate() + " " + mn[d.getMonth()] + " " + d.getFullYear() + ", " + String(d.getHours()).padStart(2,"0") + ":" + String(d.getMinutes()).padStart(2,"0");
    var tc = p.type === "ann" ? "ta" : "tm";
    var tl = p.type === "ann" ? "Pengumuman" : "Pesan";
    var titleHtml = p.title ? "<div class=\"mpitt\">" + p.title + "</div>" : "";
    return "<div class=\"mpi\"><div class=\"mpib\"><span class=\"mpty " + tc + "\">" + tl + "</span>" + titleHtml + "<div class=\"mpibdy\">" + p.body + "</div><div class=\"mpidt\">" + ds + "</div></div><button class=\"dbtn\" onclick=\"delPost('" + p.id + "')\">Hapus</button></div>";
  }).join("");
}

function togglePw(id) {
  var i = document.getElementById(id);
  i.type = i.type === "password" ? "text" : "password";
}

function _hn() { document.getElementById("navlinks").classList.toggle("open"); }

window.addEventListener("scroll", function() {
  document.getElementById("nav").classList.toggle("scrolled", window.scrollY > 20);
});

window.addEventListener("load", function() {
  // Restore session
  var u = sessionStorage.getItem("guru_u");
  if (u && GA_DATA[u]) {
    CU = u;
    document.getElementById("lform").style.display = "none";
    document.getElementById("gpanel").style.display = "block";
    document.getElementById("gname").textContent = GA_DATA[u].name;
    var mp = GA_DATA[u].mapel;
    document.getElementById("gmapel").textContent = mp.length ? mp.join(", ") : "Administrator";
  }
  // Intersection observer for animations
  var o = new IntersectionObserver(function(e) {
    e.forEach(function(x) { if (x.isIntersecting) x.target.classList.add("on"); });
  }, { threshold: 0.1 });
  document.querySelectorAll(".rv").forEach(function(el) { o.observe(el); });
});
