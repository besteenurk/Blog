const encoder = new TextEncoder();

async function sha256Hex(input: string): Promise<string> {
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export const SESSION_COOKIE = "admin_session";

/**
 * The cookie never stores the raw password. It stores a hash derived from
 * the password + a server-only secret, so the cookie value is useless on
 * its own even if it leaked.
 */
export async function getExpectedToken(): Promise<string> {
  const password = process.env.ADMIN_PASSWORD ?? "";
  const secret = process.env.ADMIN_SECRET ?? "";
  return sha256Hex(`${password}:${secret}`);
}

export async function isCorrectPassword(password: string): Promise<boolean> {
  const real = process.env.ADMIN_PASSWORD ?? "";
  if (!real) return false;
  return password === real;
}

export async function isTokenValid(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const expected = await getExpectedToken();
  return token === expected;
}
