// docker HEALTHCHECK: the server speaks https when NODE_ENV=production (see lib/config/tls.ts)
const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

try {
  const res = await fetch(`${protocol}://localhost:${process.env.PORT || 7070}/`, {
    headers: { 'x-openstatus': process.env.OPENSTATUS_HEADER ?? '' },
    // the certificate is issued for the public domain, not localhost
    tls: { rejectUnauthorized: false },
    signal: AbortSignal.timeout(5000),
  });
  process.exit(res.ok ? 0 : 1);
} catch {
  process.exit(1);
}
