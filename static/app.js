async function callApi(url, payload) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || data.ok === false) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return data;
}

const $ = (id) => document.getElementById(id);

// Elements (must match your HTML ids)
const keyEl = $("key");
const rotor1El = $("rotor1");
const rotor2El = $("rotor2");
const rotor3El = $("rotor3");
const startEl = $("start_positions");
const plugEl = $("plugboard");

const textEl = $("text");
const outputEl = $("output");

const encryptBtn = $("encryptBtn");
const decryptBtn = $("decryptBtn");
const clearBtn = $("clearBtn");
const copyBtn = $("copyBtn");

// Toast (optional)
const toast = $("toast");

function showToast(msg) {
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1600);
}

// Helpers
function getSettings() {
  return {
    key: (keyEl?.value || "").trim(),
    rotor1: parseInt(rotor1El?.value || "0", 10),
    rotor2: parseInt(rotor2El?.value || "0", 10),
    rotor3: parseInt(rotor3El?.value || "0", 10),
    start_positions: (startEl?.value || "").trim(), // e.g. "AAA" or "0,0,0" حسب backend ديالك
    plugboard: (plugEl?.value || "").trim(), // e.g. "AB CD EF"
  };
}

async function doEncrypt() {
  const text = textEl.value || "";

  if (!text.trim()) {
    showToast("كتب شي نص باش نـEncrypt ✍️");
    return;
  }

  const payload = { text, ...getSettings() };
  const data = await callApi("/api/encrypt", payload);

  outputEl.value = data.result ?? "";
  showToast("Encrypted ✅");
}

async function doDecrypt() {
  const text = textEl.value || "";

  if (!text.trim()) {
    showToast("كتب شي نص باش نـDecrypt ✍️");
    return;
  }

  const payload = { text, ...getSettings() };
  const data = await callApi("/api/decrypt", payload);

  outputEl.value = data.result ?? "";
  showToast("Decrypted ✅");
}

// Bind buttons
encryptBtn?.addEventListener("click", () => {
  doEncrypt().catch((e) => {
    console.error(e);
    showToast(e.message || "Encrypt error ❌");
  });
});

decryptBtn?.addEventListener("click", () => {
  doDecrypt().catch((e) => {
    console.error(e);
    showToast(e.message || "Decrypt error ❌");
  });
});

clearBtn?.addEventListener("click", () => {
  textEl.value = "";
  outputEl.value = "";
  showToast("Cleared 🧹");
});

copyBtn?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(outputEl.value || "");
    showToast("Copied ✅");
  } catch (e) {
    console.error(e);
    showToast("Copy failed ❌");
  }
});

// Theme toggle (optional, if you have themeBtn in HTML)
const themeBtn = $("themeBtn");

if (themeBtn) {
  const saved = localStorage.getItem("theme");

  if (saved === "light") {
    document.body.classList.add("light");
  }

  themeBtn.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";

  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");

    const isLight = document.body.classList.contains("light");
    localStorage.setItem("theme", isLight ? "light" : "dark");

    themeBtn.textContent = isLight ? "☀️" : "🌙";
    showToast(isLight ? "Light mode" : "Dark mode");
  });
}
