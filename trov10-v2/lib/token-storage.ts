export type StoredTokens = {
  accessToken: string
  refreshToken: string
} | null

const ACCESS_KEY = 'sb-access-token'
const REFRESH_KEY = 'sb-refresh-token'

export function saveTokens(tokens: { accessToken: string; refreshToken: string }): void {
  try {
    localStorage.setItem(ACCESS_KEY, tokens.accessToken)
    localStorage.setItem(REFRESH_KEY, tokens.refreshToken)
  } catch (_) {
    // ignore storage errors
  }
}

export function getTokens(): StoredTokens {
  try {
    const accessToken = localStorage.getItem(ACCESS_KEY) || ''
    const refreshToken = localStorage.getItem(REFRESH_KEY) || ''
    if (!accessToken || !refreshToken) return null
    return { accessToken, refreshToken }
  } catch (_) {
    return null
  }
}

export function clearTokens(): void {
  try {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  } catch (_) {
    // ignore
  }
}

export function decodeJwt(token: string): any | null {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch (_) {
    return null
  }
}

