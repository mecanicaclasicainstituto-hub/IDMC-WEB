# Configuración de pagos

El checkout de producción usa Netlify Functions y Mercado Pago. `payments-server` es un servidor local alternativo y no forma parte del flujo desplegado en Netlify.

## Variables de entorno

Configura estas variables en el sitio de Netlify:

- `MP_ACCESS_TOKEN`: token privado de Mercado Pago del usuario vendedor. No lo expongas en HTML ni en JavaScript del navegador.
- La conexión de Netlify DB debe estar habilitada para que `db/index.ts` pueda acceder a la tabla `orders`.

## Base de datos

Aplica una vez la migración ubicada en `netlify/database/migrations/20260803054933_create_orders/migration.sql` sobre la base de datos de producción. Sin la tabla `orders`, el checkout no puede registrar compras.

## Flujo

1. `pago.html` envía `productId`, nombre y correo a `/api/payments/checkout`.
2. La función valida el producto y el precio del catálogo del servidor, crea la orden y genera la preferencia de Mercado Pago.
3. Mercado Pago redirige a una página de resultado con el identificador y token de la orden.
4. El webhook o la consulta de estado sincroniza el pago desde la API de Mercado Pago.
5. El curso solo se agrega cuando `/api/payments/status` devuelve `status: "approved"`.

## Prueba antes de publicar

Con las dependencias instaladas, ejecuta `npx netlify dev` y abre el checkout desde ese servidor. Usa las credenciales de prueba de Mercado Pago para verificar la secuencia completa. No pruebes un pago real hasta confirmar que la orden pasa por `pending` y termina en `approved`.