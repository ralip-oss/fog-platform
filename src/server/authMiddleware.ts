import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

export interface AuthenticatedUser {
  uid: string;
  email?: string;
  name?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

function getApiKey(): string {
  try {
    const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      return config.apiKey || '';
    }
  } catch (e) {
    console.error('[Auth] Erro ao ler apiKey de firebase-applet-config.json:', e);
  }
  return '';
}

/**
 * Valida o Firebase ID Token através da API Identity Toolkit da Google
 * e verifica se o UID do utilizador coincide estritamente com ADMIN_UID.
 */
export async function requireAdminAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Autenticação necessária. Cabeçalho Authorization com Bearer token em falta.',
    });
    return;
  }

  const idToken = authHeader.split('Bearer ')[1]?.trim();

  if (!idToken) {
    res.status(401).json({ error: 'Token de autenticação vazio ou inválido.' });
    return;
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    res.status(500).json({ error: 'Chave de API Firebase não encontrada no servidor.' });
    return;
  }

  try {
    // Validação criptográfica do ID Token diretamente na Google Identity Toolkit
    const lookupUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`;
    const response = await fetch(lookupUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    const data = (await response.json()) as any;

    if (!response.ok || !data.users || data.users.length === 0) {
      res.status(401).json({
        error: 'Sessão expirada ou token de autenticação inválido. Por favor, volte a autenticar-se.',
      });
      return;
    }

    const firebaseUser = data.users[0];
    const uid = firebaseUser.localId;
    const email = firebaseUser.email;
    const name = firebaseUser.displayName;

    const adminUidConfigurado = (process.env.ADMIN_UID || '').trim();

    // Verificação estrita de autorização de administrador
    if (!adminUidConfigurado) {
      res.status(403).json({
        error:
          'ADMIN_UID não está configurado no servidor. O seu UID do Firebase é: ' +
          uid +
          '. Adicione ADMIN_UID="' +
          uid +
          '" às variáveis de ambiente/secrets para ter acesso de administrador.',
        uid,
        email,
      });
      return;
    }

    if (uid !== adminUidConfigurado) {
      res.status(403).json({
        error:
          'Acesso negado: o utilizador autenticado não possui privilégios de administrador. O seu UID é "' +
          uid +
          '", mas o ADMIN_UID configurado é "' +
          adminUidConfigurado +
          '".',
        uid,
        email,
      });
      return;
    }

    req.user = { uid, email, name };
    next();
  } catch (err: any) {
    console.error('[Auth] Erro ao validar token:', err);
    res.status(500).json({ error: 'Erro interno ao validar credenciais administrativas.' });
  }
}
