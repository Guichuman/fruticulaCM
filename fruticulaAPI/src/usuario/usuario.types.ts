import { Usuario } from './entities/usuario.entity';

export type UsuarioSemSenha = Omit<Usuario, 'senha'>;

export interface RespostaLogin {
  token: string;
  usuario: UsuarioSemSenha;
}
