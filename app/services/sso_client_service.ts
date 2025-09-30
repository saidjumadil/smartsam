import { Issuer, Client } from 'openid-client'

let client: Client | null = null

export async function getSSOClient() {
  if (!client) {
    // Discover endpoint dari Keycloak
    const issuer = await Issuer.discover('https://sso.unsam.ac.id/realms/Production/.well-known/openid-configuration')

    client = new issuer.Client({
      client_id: process.env.SSO_CLIENT_ID || 'smartsam',
      client_secret: process.env.SSO_CLIENT_SECRET || 'IZ1NR6Jws0CS9FJYo6zVZVAjQSNQr5aC',
      redirect_uris: [process.env.SSO_CALLBACK_URL || 'http://103.132.124.193/callback'],
      response_types: ['code'],
    })
  }
  return client
}
