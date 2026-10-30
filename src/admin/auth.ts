const AUTH_KEY = 'personal-site:auth'
const USER = 'admin'
const PASSWORD = 'admin123'

export function isAuthed(): boolean {
  try {
    return window.localStorage.getItem(AUTH_KEY) === 'ok'
  } catch {
    return false
  }
}

export function login(username: string, password: string): boolean {
  if (username.trim() === USER && password === PASSWORD) {
    window.localStorage.setItem(AUTH_KEY, 'ok')
    return true
  }
  return false
}

export function logout(): void {
  window.localStorage.removeItem(AUTH_KEY)
}
