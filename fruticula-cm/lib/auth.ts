// Funções utilitárias para autenticação

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('isLoggedIn') === 'true';
}

export function getUsuario() {
  if (typeof window === 'undefined') return null;
  const usuarioStr = localStorage.getItem('usuario');
  return usuarioStr ? JSON.parse(usuarioStr) : null;
}

export function logout() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('usuario');
  localStorage.removeItem('isLoggedIn');
}
