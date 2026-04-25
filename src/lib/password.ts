/**
 * Hash de contraseñas usando SHA-256 con Web Crypto API (nativo en Cloudflare Workers).
 *
 * NOTA: SHA-256 puro NO incluye salt ni iteraciones; suficiente para desarrollo
 * pero deberías migrar a Argon2id o bcrypt cuando el proyecto sea productivo.
 */

/** Devuelve el hash SHA-256 de un string en formato hexadecimal (64 chars). */
export async function hashPassword(plain: string): Promise<string> {
  const data = new TextEncoder().encode(plain);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Verifica si una contraseña coincide con un hash almacenado. */
export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  if (!stored) return false;
  const computed = await hashPassword(plain);
  // Comparación constante para evitar timing attacks básicos
  if (computed.length !== stored.length) return false;
  let result = 0;
  for (let i = 0; i < computed.length; i++) {
    result |= computed.charCodeAt(i) ^ stored.charCodeAt(i);
  }
  return result === 0;
}
