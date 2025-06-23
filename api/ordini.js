export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Preflight CORS OK
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const { order_id, email } = req.body;
  if (!order_id || !email) {
    return res.status(400).json({ error: 'Parametri mancanti' });
  }

  const shop = "verticalgolf.myshopify.com";
  const token = process.env.SHOPIFY_API_TOKEN;

  const response = await fetch(`https://${shop}/admin/api/2024-01/orders/${order_id}.json`, {
    headers: {
      "X-Shopify-Access-Token": token,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    return res.status(response.status).json({ error: "Errore Shopify: " + response.statusText });
  }

  const data = await response.json();
  const ordine = data.order;

  if (!ordine) {
    return res.status(404).json({ error: 'Ordine non trovato' });
  }

  if (ordine.email.toLowerCase() !== email.toLowerCase()) {
    return res.status(403).json({ error: 'Email non corrispondente' });
  }

  return res.status(200).json({
    nome: ordine.customer?.first_name + ' ' + ordine.customer?.last_name,
    email: ordine.email,
    data: ordine.created_at,
    prodotti: ordine.line_items.map(item => ({
      titolo: item.title,
      sku: item.sku,
      quantita: item.quantity
    })),
    indirizzo: ordine.shipping_address
  });
}
