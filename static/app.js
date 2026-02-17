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
