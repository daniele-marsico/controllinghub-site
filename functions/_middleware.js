// Anteprime social diverse per lo stesso URL: ?v=<variante> sostituisce og:image e og:title.
const V = {
  prenota: 'Prenotazioni senza telefonate durante il servizio',
  report: 'Il report del lunedì, senza farlo a mano',
  consegne: 'Ordini, cucina e rider in un unico pannello',
  aziende: 'Il pranzo delle aziende vicine, con un conto mensile',
  natale: 'Natale: caparra sulle prenotazioni e ordini programmati',
  clienti: 'I clienti abituali sono tuoi, non della piattaforma',
  tavolo: 'Ordine e pagamento dal tavolo con un QR',
  personale: 'Quanto pesa il personale su ogni servizio?',
  checkup: 'Check-up del ristorante: food cost, margini, personale',
};
export async function onRequest({ request, next }) {
  const res = await next();
  try {
    const v = new URL(request.url).searchParams.get('v');
    if (!v || !V[v] || !(res.headers.get('content-type') || '').includes('text/html')) return res;
    const img = `https://controllinghub.com/img/og-v-${v}.jpg`;
    return new HTMLRewriter()
      .on('meta[property="og:image"]', { element(e) { e.setAttribute('content', img); } })
      .on('meta[property="og:title"]', { element(e) { e.setAttribute('content', V[v] + ' — ControllingHub'); } })
      .transform(res);
  } catch (e) { return res; }
}
