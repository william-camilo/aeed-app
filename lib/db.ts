import { env } from 'cloudflare:workers';
export function database(){ if(!env.DB) throw new Error('Banco indisponível. Tente novamente em instantes.'); return env.DB; }
export type AppUser={id:string;name:string;email:string;role:'attendant'|'manager'|'admin';companyId:string};
export function cookie(req:Request,name:string){return req.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith(`${name}=`))?.slice(name.length+1) || '';}
export async function sha256(value:string){const bytes=new TextEncoder().encode(value);const digest=await crypto.subtle.digest('SHA-256',bytes);return [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,'0')).join('');}
export async function currentUser(req:Request):Promise<AppUser|null>{
  const db=database(); const token=cookie(req,'aeed_session');
  if(token){const hash=await sha256(token);const row=await db.prepare('SELECT u.id,u.name,u.email,u.role,u.company_id,s.active FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? ORDER BY s.created_at DESC LIMIT 1').bind(hash).first<any>();if(row?.active){await db.prepare('UPDATE sessions SET last_activity=? WHERE token_hash=? AND active=1').bind(Date.now(),hash).run();return {id:row.id,name:row.name,email:row.email,role:row.role,companyId:row.company_id};}return null;}
  return null;
}
export async function identity(req:Request){const user=await currentUser(req);if(!user)throw new Error('Sessão inválida. Entre novamente.');return user.id;}
export async function userIdentity(req:Request){const user=await currentUser(req);if(!user)throw new Error('Sessão inválida. Entre novamente.');return user;}
export function sameOrigin(req:Request){const origin=req.headers.get('origin'); if(origin && origin!==new URL(req.url).origin)throw new Error('Origem não autorizada.');}
