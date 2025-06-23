export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const { order_number, email } = req.body;
  if (!order_number || !email) {
    return res.status(400).json({ error: 'Parametri mancanti' });
  }

  const shop = "verticalgolf.myshopify.com"; // Cambia se necessario
  const token = process.env.SHOPIFY_API_TOKEN;

  const response = await fetch(`https://${shop}/admin/api/2024-01/orders.json?name=%23${order_number}`, {
    headers: {
      "X-Shopify-Access-Token": token,
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();
  const ordine = data.orders && data.orders[0];

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
