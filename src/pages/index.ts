// src/pages/index.ts
// Endpoint que redirige la raíz a /es/ con HTTP 308 (permanente)
import type { APIContext } from 'astro';

export const prerender = false;

export function GET({ request }: APIContext) {
  // Construye URL absoluta usando la URL de la petición
  const location = new URL('/es/', request.url);
  return Response.redirect(location, 308); // usa 307 si prefieres temporal
}
