// Cloudflare Worker "controllinghub-contatti"
// Riceve il modulo contatti del sito (POST /api/contatti) e lo inoltra via
// Cloudflare Email Routing a controllinghubitaly@gmail.com (binding MAIL).
// Route: controllinghub.com/api/*  e  www.controllinghub.com/api/*
import { EmailMessage } from "cloudflare:email";

const FROM = "sito@controllinghub.com";
const TO = "controllinghubitaly@gmail.com";
const ALLOWED = ["https://controllinghub.com", "https://www.controllinghub.com", "https://controllinghub.pages.dev"];

function cors(origin) {
  const o = ALLOWED.includes(origin) ? origin : ALLOWED[0];
  return {
    "Access-Control-Allow-Origin": o,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors(origin) },
  });
}

function b64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function clean(v, max) {
  return String(v ?? "").replace(/\r/g, "").trim().slice(0, max);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
    if (url.pathname !== "/api/contatti" || request.method !== "POST") {
      return json({ success: false, message: "Not found" }, 404, origin);
    }

    let d;
    try {
      const ct = request.headers.get("Content-Type") || "";
      d = ct.includes("application/json")
        ? await request.json()
        : Object.fromEntries(await request.formData());
    } catch {
      return json({ success: false, message: "Dati non validi" }, 400, origin);
    }

    // Honeypot anti-spam: se compilato, fingiamo successo e non inviamo nulla
    if (d._honey) return json({ success: true }, 200, origin);

    const azienda = clean(d.azienda, 200);
    const nome = clean(d.nome, 200);
    const email = clean(d.email, 200).replace(/\n/g, "");
    const area = clean(d.area, 200);
    const messaggio = clean(d.messaggio, 5000);
    const lingua = clean(d.lingua, 5) || "it";

    if (!azienda || !nome || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) {
      return json({ success: false, message: "Campi obbligatori mancanti" }, 400, origin);
    }

    const subject = `Nuova richiesta dal sito: ${azienda}${lingua === "en" ? " (EN)" : ""}`;
    const body = [
      `Azienda: ${azienda}`,
      `Nome e ruolo: ${nome}`,
      `Email: ${email}`,
      `Da dove partirebbero: ${area || "-"}`,
      `Lingua sito: ${lingua}`,
      "",
      "Messaggio:",
      messaggio || "-",
      "",
      "--",
      "Inviato dal modulo contatti di controllinghub.com. Premi Rispondi per scrivere direttamente al cliente.",
    ].join("\n");

    const raw = [
      `From: "Sito ControllingHub" <${FROM}>`,
      `To: <${TO}>`,
      `Reply-To: <${email}>`,
      `Subject: =?UTF-8?B?${b64(subject)}?=`,
      `Message-ID: <${crypto.randomUUID()}@controllinghub.com>`,
      `Date: ${new Date().toUTCString()}`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=UTF-8",
      "Content-Transfer-Encoding: base64",
      "",
      b64(body).replace(/.{76}/g, "$&\r\n"),
    ].join("\r\n");

    try {
      await env.MAIL.send(new EmailMessage(FROM, TO, raw));
      return json({ success: true }, 200, origin);
    } catch (e) {
      return json({ success: false, message: "Invio non riuscito" }, 502, origin);
    }
  },
};
