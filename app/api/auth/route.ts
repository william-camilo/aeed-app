import { z } from 'zod';
import { database, sha256, passwordHash, cookie, currentUser, sameOrigin } from '@/lib/db';
import type { PlanId } from '@/lib/plans';

const json=(data:unknown,status=200,headers:Record<string,string>={})=>Response.json(data,{status,headers:{'Cache-Control':'no-store',...headers}});
const sessionCookie=(token:string,maxAge=60*60*24*30)=>`aeed_session=${token}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${maxAge}`;
const credentials=z.object({email:z.string().trim().email().max(200),password:z.string().min(8).max(200)});
const signup=credentials.extend({name:z.string().trim().min(2).max(120),plan:z.enum(['individual','team','company']).default('individual')});
function userView(u:any){return {id:u.id,name:u.name,email:u.email,role:u.role,companyId:u.company_id||u.companyId,plan:(u.plan||'individual') as PlanId,subscriptionStatus:u.subscription_status||u.subscriptionStatus||'active'};}

export async function GET(req:Request){try{const user=await currentUser(req);return user?json({user,canSignup:false}):json({user:null,canSignup:true},401);}catch(e){return json({user:null,canSignup:true},401);}}

export async function POST(req:Request){
  try{sameOrigin(req);const body:any=await req.json();const db=database();
    if(body.action==='logout'){const token=cookie(req,'aeed_session');if(token)await db.prepare('UPDATE sessions SET active=0,reason=? WHERE token_hash=?').bind('logout',await sha256(token)).run();return json({ok:true},200,{'Set-Cookie':sessionCookie('',0)});}
    if(body.action==='signup'){
      const v=signup.parse(body);const existing=await db.prepare('SELECT id FROM users WHERE lower(email)=lower(?)').bind(v.email).first();if(existing)return json({error:'Este e-mail já possui uma conta.'},409);
      const role=v.plan==='individual'?'attendant':'manager';const companyId=`company_${crypto.randomUUID()}`;const salt=crypto.randomUUID();const hash=await passwordHash(v.password,salt);const id=crypto.randomUUID();await db.prepare('INSERT INTO users(id,name,email,password_hash,password_salt,current_session_hash,role,company_id,plan,subscription_status,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)').bind(id,v.name,v.email.toLowerCase(),hash,salt,null,role,companyId,v.plan,'active',Date.now()).run();return createSession(db,{id,name:v.name,email:v.email,role,company_id:companyId,plan:v.plan,subscription_status:'active'},req);
    }
    const v=credentials.parse(body);const user=await db.prepare('SELECT * FROM users WHERE lower(email)=lower(?)').bind(v.email).first<any>();if(!user||await passwordHash(v.password,user.password_salt)!==user.password_hash)return json({error:'E-mail ou senha inválidos.'},401);return createSession(db,user,req);
  }catch(e){return json({error:e instanceof z.ZodError?'Informe nome, e-mail e uma senha com pelo menos 8 caracteres.':'Não foi possível concluir o acesso.'},400);}
}
async function createSession(db:any,user:any,req:Request){const token=crypto.randomUUID()+crypto.randomUUID();const hash=await sha256(token);const now=Date.now();await db.batch([db.prepare('UPDATE users SET current_session_hash=? WHERE id=?').bind(hash,user.id),db.prepare('UPDATE sessions SET active=0,reason=? WHERE user_id=? AND active=1').bind('new_login',user.id),db.prepare('INSERT INTO sessions(id,user_id,token_hash,device_name,browser,ip_address,created_at,last_activity,active,reason) VALUES(?,?,?,?,?,?,?,?,1,?)').bind(crypto.randomUUID(),user.id,hash,req.headers.get('sec-ch-ua-platform')||'Dispositivo',req.headers.get('user-agent')?.slice(0,180)||'Navegador',req.headers.get('cf-connecting-ip')||'',now,now,'active')]);return json({user:userView(user)},200,{'Set-Cookie':sessionCookie(token)});}
