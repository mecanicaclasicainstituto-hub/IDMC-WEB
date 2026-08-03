const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MercadoPagoConfig, Preference } = require('mercadopago');

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);
const publicBaseUrl = process.env.PUBLIC_BASE_URL || 'http://127.0.0.1:5501';

app.use(cors());
app.use(express.json());

const token = process.env.MP_ACCESS_TOKEN || '';
if (!token) {
  console.warn('MP_ACCESS_TOKEN no configurado. Configuralo en .env para crear cobros.');
}
const mpClient = new MercadoPagoConfig({ accessToken: token });
const preferenceApi = new Preference(mpClient);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'idmc-payments-server' });
});

app.post('/api/payments/create-preference', async (req, res) => {
  try {
    const title = String(req.body.title || '').trim();
    const rawPrice = Number(req.body.price || 0);
    const user = String(req.body.user || 'estudiante').trim();

    if (!title || !rawPrice || rawPrice <= 0) {
      return res.status(400).json({ error: 'Datos invalidos para crear pago.' });
    }

    const preference = {
      items: [
        {
          title,
          quantity: 1,
          currency_id: 'MXN',
          unit_price: Number(rawPrice)
        }
      ],
      payer: {
        nickname: user
      },
      back_urls: {
        success: `${publicBaseUrl}/pago-exito.html`,
        failure: `${publicBaseUrl}/pago-error.html`,
        pending: `${publicBaseUrl}/pago-pendiente.html`
      },
      metadata: {
        user,
        course: title
      }
    };

    const result = await preferenceApi.create({ body: preference });
    return res.json({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point
    });
  } catch (err) {
    console.error('Error creando preferencia:', err.message);
    const detail = (err && err.cause && err.cause.message) ? String(err.cause.message) : '';
    return res.status(500).json({ error: 'No se pudo crear la preferencia de pago.' + (detail ? (' Detalle: ' + detail) : '') });
  }
});

app.post('/api/payments/webhook', (req, res) => {
  console.log('Webhook recibido:', req.body);
  return res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`IDMC payments server activo en http://127.0.0.1:${port}`);
});
