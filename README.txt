ISTRUZIONI:

1. Vai su https://vercel.com/dashboard
2. Crea un nuovo progetto > "Importa da Git" > scegli "Importa manualmente"
3. Carica questa cartella (scompattata) come progetto Node.js
4. Nelle "Environment Variables", crea:
   - chiave: SHOPIFY_API_TOKEN
   - valore: il token API shpat_********
5. Una volta deployato, prova con una POST a:
   https://[tuo-progetto].vercel.app/api/ordini

Payload richiesto (JSON):
{
  "order_number": "2613",
  "email": "cliente@email.it"
}
