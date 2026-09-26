import { env } from 'cloudflare:workers';
export function database(){ if(!env.DB) throw new Error('Banco indisponível. Tente novamente em instantes.'); return env.DB; }
export function identity(req:Request){ const id=req.headers.get('oai-authenticated-user-id'); if(!id) throw new Error('Entre na sua conta para salvar e analisar atendimentos.'); return id; }
export function sameOrigin(req:Request){const origin=req.headers.get('origin'); if(origin && origin!==new URL(req.url).origin)throw new Error('Origem não autorizada.');}
