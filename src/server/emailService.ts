import { Resend } from 'resend';
import { EstadoNotificacao, Proposta, updateProposta } from './db';

export interface ResultadoNotificacao {
  estado: EstadoNotificacao;
  emailServiceId?: string | null;
  mensagem: string;
  erro?: string;
}

/**
 * Envia notificação interna ao aluno através do Resend (sem necessidade de domínio próprio).
 * Regras estritas:
 * - O destinatário é EXCLUSIVAMENTE o email associado à conta Resend do aluno (EMAIL_ALUNO).
 * - O remetente é fixo: onboarding@resend.dev
 * - Nunca são enviados emails para os clientes.
 */
export async function enviarNotificacaoAoAluno(
  proposta: Proposta,
  pedidoId: string
): Promise<ResultadoNotificacao> {
  const apiKey = process.env.RESEND_API_KEY;
  const emailAluno = process.env.EMAIL_ALUNO?.trim();
  const now = new Date().toISOString();

  // Verificação de configuração
  if (!apiKey || !emailAluno) {
    const msg =
      'Notificação não enviada: RESEND_API_KEY ou EMAIL_ALUNO não se encontram configurados nas variáveis de ambiente.';
    console.log(`[Email] ${msg}`);

    await updateProposta(proposta.id, {
      estadoNotificacao: 'nao_configurado',
      dataTentativaEnvio: now,
      erroEnvio: 'Credenciais Resend ou EMAIL_ALUNO ausentes no ambiente.',
    });

    return {
      estado: 'nao_configurado',
      mensagem: msg,
    };
  }

  try {
    const resend = new Resend(apiKey);

    const linkProposta = proposta.linkAcesso;
    const assunto = 'Nova proposta gerada — Fog';

    const totalEuros = (proposta.totalCentimos / 100).toLocaleString('pt-PT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${assunto}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    <div style="background-color: #0f172a; padding: 20px 24px; border-bottom: 2px solid #38bdf8;">
      <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">FOG • Sistema de Propostas</h1>
      <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 12px;">Notificação interna ao Aluno (Modo de Aula)</p>
    </div>
    
    <div style="padding: 24px;">
      <p style="font-size: 15px; line-height: 1.5; margin-top: 0;">
        Olá! Foi gerada com sucesso uma nova proposta comercial no seguimento de um pedido de proposta no website <strong>Fog</strong>.
      </p>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="color: #64748b; padding: 4px 0;">N.º da Proposta:</td>
            <td style="font-weight: 700; color: #0f172a; text-align: right; padding: 4px 0;">${proposta.numeroProposta}</td>
          </tr>
          <tr>
            <td style="color: #64748b; padding: 4px 0;">Ref. Pedido:</td>
            <td style="font-family: monospace; color: #0f172a; text-align: right; padding: 4px 0;">${pedidoId}</td>
          </tr>
          <tr>
            <td style="color: #64748b; padding: 4px 0;">Valor Total sem IVA:</td>
            <td style="font-weight: 800; color: #059669; text-align: right; padding: 4px 0; font-size: 16px;">${totalEuros} €</td>
          </tr>
          <tr>
            <td style="color: #64748b; padding: 4px 0;">Âmbito Resumido:</td>
            <td style="color: #334155; text-align: right; padding: 4px 0;">${proposta.resumoAmbito}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${linkProposta}" style="display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 14px; box-shadow: 0 2px 4px rgba(5, 150, 105, 0.2);">
          Consultar Proposta
        </a>
      </div>

      <p style="font-size: 12px; color: #64748b; line-height: 1.5;">
        Se o botão acima não funcionar, copie e cole o seguinte link no seu navegador:<br>
        <a href="${linkProposta}" style="color: #0284c7; word-break: break-all;">${linkProposta}</a>
      </p>

      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; line-height: 1.4;">
        <strong>Nota importante (Modo de Aula):</strong> Esta mensagem foi enviada exclusivamente para o seu endereço de aluno registrado no Resend. Os potenciais clientes nunca recebem emails automáticos neste exercício.
      </div>
    </div>
  </div>
</body>
</html>
    `;

    const textContent = `
Nova proposta gerada — Fog
N.º da Proposta: ${proposta.numeroProposta}
Ref. do Pedido: ${pedidoId}
Valor Total sem IVA: ${totalEuros} €

Resumo: ${proposta.resumoAmbito}

Consultar Proposta no link:
${linkProposta}

Nota (Modo de Aula): As notificações são enviadas apenas para o aluno. Os clientes não recebem emails.
    `.trim();

    console.log(`[Email] A enviar notificação para EMAIL_ALUNO (${emailAluno}) através de onboarding@resend.dev...`);

    const { data, error } = await resend.emails.send({
      from: 'Fog Notificações <onboarding@resend.dev>',
      to: [emailAluno],
      subject: assunto,
      html: htmlContent,
      text: textContent,
    });

    if (error) {
      console.error('[Email] Erro devolvido pela API Resend:', error);
      const msgErro = error.message || 'Erro ao contactar API Resend';

      await updateProposta(proposta.id, {
        estadoNotificacao: 'falhou',
        dataTentativaEnvio: now,
        erroEnvio: msgErro,
      });

      return {
        estado: 'falhou',
        mensagem: `Falha no envio da notificação: ${msgErro}`,
        erro: msgErro,
      };
    }

    const emailId = data?.id || 'resend-id-ok';
    console.log(`[Email] Notificação aceite pelo serviço Resend com ID: ${emailId}`);

    await updateProposta(proposta.id, {
      estadoNotificacao: 'aceite',
      emailServiceId: emailId,
      dataTentativaEnvio: now,
      erroEnvio: null,
    });

    return {
      estado: 'aceite',
      emailServiceId: emailId,
      mensagem: 'Notificação aceite com sucesso pelo serviço Resend.',
    };
  } catch (err: any) {
    console.error('[Email] Exceção durante o envio de email:', err);
    const msgErro = err.message || 'Exceção não tratada ao enviar notificação';

    await updateProposta(proposta.id, {
      estadoNotificacao: 'falhou',
      dataTentativaEnvio: now,
      erroEnvio: msgErro,
    });

    return {
      estado: 'falhou',
      mensagem: `Falha no envio da notificação: ${msgErro}`,
      erro: msgErro,
    };
  }
}
