async function postJSON(url, payload) {
const res = await fetch(url, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(payload),
});
const data = await res.json();
if (!res.ok) throw new Error(data.error || "Request failed");
return data;
}

function settings() {
return {
key: document.getElementById("key").value,
rotor1: document.getElementById("rotor1").value,
rotor2: document.getElementById("rotor2").value,
rotor3: document.getElementById("rotor3").value,
start_positions: document.getElementById("start_positions").value,
plugboard: document.getElementById("plugboard").value,
};
}

function setStatus(msg, isError=false) {
const el = document.getElementById("status");
el.textContent = msg;
el.className = "status " + (isError ? "error" : "ok");
}

document.getElementById("btnEncrypt").addEventListener("click", async () => {
try {
setStatus("Encrypting...");
const text = document.getElementById("text").value;
const data = await postJSON("/api/encrypt", { text, ...settings() });
document.getElementById("result").value = data.result;
setStatus("Done ✅");
} catch (e) {
setStatus(e.message, true);
}
});

document.getElementById("btnDecrypt").addEventListener("click", async () => {
try {
setStatus("Decrypting...");
const text = document.getElementById("text").value;
const data = await postJSON("/api/decrypt", { text, ...settings() });
document.getElementById("result").value = data.result;
setStatus("Done ✅");
} catch (e) {
setStatus(e.message, true);
}
});

document.getElementById("btnSwap").addEventListener("click", () => {
const t = document.getElementById("text");
const r = document.getElementById("result");
const tmp = t.value;
t.value = r.value;
r.value = tmp;
setStatus("Swapped ↔️");
});
:root {
  --bg: #0b1020;
  --card: rgba(255, 255, 255, 0.06);
  --card2: rgba(255, 255, 255, 0.08);
  --text: rgba(255, 255, 255, 0.92);
  --muted: rgba(255, 255, 255, 0.62);
  --border: rgba(255, 255, 255, 0.12);
  --shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
  --primary: #7c3aed;
  --primary2: #22c55e;
  --danger: #ef4444;
  --input: rgba(255, 255, 255, 0.08);
}

/* Light Theme */
body.light {
  --bg: #f5f7ff;
  --card: rgba(255, 255, 255, 0.75);
  --card2: rgba(255, 255, 255, 0.9);
  --text: rgba(15, 23, 42, 0.92);
  --muted: rgba(15, 23, 42, 0.6);
  --border: rgba(15, 23, 42, 0.12);
  --shadow: 0 20px 60px rgba(2, 6, 23, 0.12);
  --input: rgba(2, 6, 23, 0.06);
}

/* Reset */
* {
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

/* Body */
body {
  margin: 0;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial,
    "Apple Color Emoji", "Segoe UI Emoji";

  background:
    radial-gradient(1200px 600px at 20% 10%, rgba(124, 58, 237, 0.25), transparent 60%),
    radial-gradient(900px 500px at 80% 20%, rgba(34, 197, 94, 0.2), transparent 55%),
    radial-gradient(900px 700px at 50% 90%, rgba(59, 130, 246, 0.18), transparent 60%),
    var(--bg);

  color: var(--text);
  overflow-x: hidden;
}

/* Background Orbs */
.bg-orb {
  position: fixed;
  width: 380px;
  height: 380px;
  filter: blur(55px);
  opacity: 0.25;
  border-radius: 999px;
  pointer-events: none;
  z-index: 0;
}

.orb-1 {
  top: -120px;
  left: -120px;
  background: #7c3aed;
}

.orb-2 {
  top: 120px;
  right: -160px;
  background: #22c55e;
}

.orb-3 {
  bottom: -160px;
  left: 30%;
  background: #3b82f6;
}

/* Top Bar */
.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(10px);

  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.25),
    rgba(0, 0, 0, 0)
  );

  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding: 18px;
}

/* Brand */
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 1200px;
  margin: 0 auto;
  justify-content: space-between;
}

.brand-text h1 {
  margin: 0;
  font-size: 18px;
  letter-spacing: 0.2px;
}

.subtitle {
  margin-top: 2px;
  font-size: 12px;
  color: var(--muted);
}

.logo {
  width: 38px;
  height: 38px;

  display: grid;
  place-items: center;

  border-radius: 12px;

  background: linear-gradient(
    135deg,
    rgba(124, 58, 237, 0.9),
    rgba(34, 197, 94, 0.75)
  );

  box-shadow: var(--shadow);
  font-weight: 800;
}

/* Actions */
.top-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-left: auto;
}

/* Container */
.container {
  position: relative;
  z-index: 2;

  max-width: 1200px;
  margin: 18px auto 60px;
  padding: 0 18px;

  display: grid;
  gap: 16px;
}

/* Desktop */
@media (min-width: 980px) {
  .container {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }

  .footer {
    grid-column: 1 / -1;
  }
}

/* Card */
.card {
  background: linear-gradient(180deg, var(--card2), var(--card));
  border: 1px solid var(--border);
  border-radius: 18px;
  box-shadow: var(--shadow);
  padding: 16px;
}

/* Card Header */
.card-head h2 {
  margin-bottom: 6px;
  font-size: 16px;
}

.card-head p {
  margin-bottom: 14px;
  color: var(--muted);
  font-size: 13px;
}

/* Grid */
.grid {
  display: grid;
  gap: 12px;
}

@media (min-width: 560px) {
  .grid {
    grid-template-columns: 1.6fr 1fr 1fr;
  }

  .grid .field:nth-child(1) {
    grid-column: 1 / -1;
  }

  .grid .field:nth-child(5) {
    grid-column: 1 / 3;
  }

  .grid .field:nth-child(6) {
    grid-column: 3 / 4;
  }
}

/* Fields */
.field label {
  display: block;
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 6px;
}

.field .hint {
  margin-top: 6px;
  font-size: 11px;
  color: var(--muted);
}

/* Inputs */
input,
textarea {
  width: 100%;
  padding: 10px 12px;

  border: 1px solid var(--border);
  border-radius: 12px;

  background: var(--input);
  color: var(--text);

  outline: none;

  transition:
    transform 0.08s ease,
    border-color 0.15s ease,
    background 0.15s ease;
}

textarea {
  resize: vertical;
  min-height: 120px;
}

input:focus,
textarea:focus {
  border-color: rgba(124, 58, 237, 0.65);
  background: rgba(124, 58, 237, 0.1);
}

/* Buttons */
.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.btn {
  padding: 10px 12px;

  border: 1px solid var(--border);
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.08);
  color: var(--text);

  cursor: pointer;
  font-weight: 600;

  transition:
    transform 0.08s ease,
    background 0.15s ease,
    border-color 0.15s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
}

.btn.primary {
  border-color: rgba(124, 58, 237, 0.55);

  background: linear-gradient(
    135deg,
    rgba(124, 58, 237, 0.95),
    rgba(59, 130, 246, 0.75)
  );
}

.btn.ghost {
  background: transparent;
}

.btn.tiny {
  padding: 8px 10px;
  border-radius: 10px;
}

/* Output */
.output-wrap {
  position: relative;
}

#copyBtn {
  position: absolute;
  top: 10px;
  right: 10px;
}

/* Divider */
.divider {
  height: 1px;
  background: var(--border);
  margin: 14px 0;
}

/* Footer */
.footer {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  align-items: center;
  justify-content: center;

  padding-top: 6px;

  color: var(--muted);
  font-size: 12px;
}

.footer .dot {
  opacity: 0.6;
}

.footer .muted {
  opacity: 0.9;
}

/* Toast */
.toast {
  position: fixed;
  left: 50%;
  bottom: 22px;

  transform: translateX(-50%);

  background: rgba(0, 0, 0, 0.7);
  color: white;

  padding: 10px 12px;
  border-radius: 12px;

  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: var(--shadow);

  opacity: 0;
  pointer-events: none;

  transition:
    opacity 0.2s ease,
    transform 0.2s ease;

  z-index: 50;
}

.toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(-2px);
}
