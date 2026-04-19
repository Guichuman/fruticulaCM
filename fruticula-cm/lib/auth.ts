/**
 * Utilitários de autenticação baseados em JWT.
 * O token JWT é armazenado no localStorage e enviado em cada requisição.
 */

const CHAVE_TOKEN = 'token_jwt';
const CHAVE_USUARIO = 'usuario';

export type PerfilUsuario = 'A' | 'F';

export interface Usuario {
  id: number;
  username: string;
  nome: string;
  status: string;
  perfil: PerfilUsuario;
  criadoEm?: string;
  atualizadoEm?: string;
}

/** Verifica se o usuário logado é administrador */
export function eAdministrador(): boolean {
  const usuario = obterUsuario();
  return usuario?.perfil === 'A';
}

/** Decodifica o payload do JWT e verifica se está expirado */
function tokenExpirado(token: string): boolean {
  try {
    const partes = token.split('.');
    if (partes.length !== 3) return true;
    const payload = JSON.parse(atob(partes[1]));
    if (!payload.exp) return false;
    // payload.exp está em segundos, Date.now() em milissegundos
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

/** Verifica se o usuário está autenticado (token JWT presente e não expirado) */
export function estaAutenticado(): boolean {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem(CHAVE_TOKEN);
  if (!token || token === 'undefined' || token === 'null') return false;
  if (tokenExpirado(token)) {
    // Limpa sessão inválida automaticamente
    localStorage.removeItem(CHAVE_TOKEN);
    localStorage.removeItem(CHAVE_USUARIO);
    return false;
  }
  return true;
}

/** Recupera o token JWT do localStorage */
export function obterToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(CHAVE_TOKEN);
  if (!token || token === 'undefined' || token === 'null') {
    localStorage.removeItem(CHAVE_TOKEN);
    return null;
  }
  return token;
}

/** Recupera os dados do usuário logado */
export function obterUsuario(): Usuario | null {
  if (typeof window === 'undefined') return null;
  const usuarioStr = localStorage.getItem(CHAVE_USUARIO);
  if (!usuarioStr || usuarioStr === 'undefined' || usuarioStr === 'null') {
    localStorage.removeItem(CHAVE_USUARIO);
    return null;
  }
  try {
    return JSON.parse(usuarioStr) as Usuario;
  } catch {
    localStorage.removeItem(CHAVE_USUARIO);
    return null;
  }
}

/** Salva token e dados do usuário após login bem-sucedido */
export function salvarSessao(token: string, usuario: Usuario): void {
  if (typeof window === 'undefined') return;
  if (!token || !usuario) return;
  localStorage.setItem(CHAVE_TOKEN, token);
  localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
}

/** Remove todos os dados de sessão (logout) */
export function encerrarSessao(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CHAVE_TOKEN);
  localStorage.removeItem(CHAVE_USUARIO);
}

// Aliases para compatibilidade retroativa com arquivos existentes
export const isAuthenticated = estaAutenticado;
export const getUsuario = obterUsuario;
export const logout = encerrarSessao;
