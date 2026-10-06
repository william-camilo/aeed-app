import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
const sql = neon(process.env.DATABASE_URL);
const ids = [];
const suffix = randomUUID();
const password = randomUUID();
async function request(path, data, cookie = '') {
  const res = await fetch(base + path, { method: data ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json', Origin: base, Cookie: cookie },
    ...(data ? { body: JSON.stringify(data) } : {}),
  });
  return { status: res.status, body: await res.json(),
    cookie: res.headers.get('set-cookie')?.split(';')[0] || '',
    setCookie: res.headers.get('set-cookie') || '' };
}
try {
  assert.equal((await request('/api/workspace')).status, 401);
  const individual = await request('/api/auth', {action:'signup',name:'Teste Individual',email:`individual-${suffix}@example.test`,password,plan:'individual'});
  assert.equal(individual.status, 200); ids.push(individual.body.user.id);
  assert.match(individual.setCookie, /HttpOnly/); assert.match(individual.setCookie, /Secure/);
  assert.equal(individual.body.user.role, 'attendant');
  assert.equal((await request('/api/team',null,individual.cookie)).status,403);
  const manager = await request('/api/auth', {action:'signup',name:'Teste Gestor',email:`manager-${suffix}@example.test`,password,plan:'team'});
  assert.equal(manager.status,200); ids.push(manager.body.user.id);
  assert.equal(manager.body.user.role,'manager');
  const email = `attendant-${suffix}@example.test`;
  const attendant = await request('/api/team',{name:'Teste Atendente',email,password},manager.cookie);
  assert.equal(attendant.status,201); ids.push(attendant.body.id);
  const first = await request('/api/auth',{login:email,password});
  assert.equal(first.status,200);
  const second = await request('/api/auth',{login:email,password});
  assert.equal(second.status,200);
  assert.equal((await request('/api/auth',null,first.cookie)).status,401);
  assert.equal((await request('/api/auth',null,second.cookie)).status,200);
  assert.equal((await request('/api/team',null,second.cookie)).status,403);
  assert.equal((await request('/api/workspace',{action:'company',value:{}},second.cookie)).status,403);
  const concurrent = await Promise.all([request('/api/auth',{login:email,password}),request('/api/auth',{login:email,password})]);
  concurrent.forEach(login => assert.equal(login.status,200));
  const checks = await Promise.all(concurrent.map(login=>request('/api/auth',null,login.cookie)));
  assert.deepEqual(checks.map(x=>x.status).sort(),[200,401]);
  const winner = concurrent[checks.findIndex(x=>x.status===200)];
  const workspace = await request('/api/workspace',null,winner.cookie);
  assert.equal(workspace.status,200); assert.deepEqual(workspace.body.analyses,[]);
  const analysis = await request('/api/analyze',{situation:'Achou caro',channel:'WhatsApp',moment:'Orçamento enviado',message:'Achei o preço alto',guided:true},winner.cookie);
  assert.equal(analysis.status,200);
  const saved = await request('/api/workspace',null,winner.cookie);
  assert.equal(saved.body.analyses[0].id,analysis.body.id);
  assert.equal(typeof saved.body.analyses[0].created_at,'number');
  assert.equal((await request('/api/workspace',null,individual.cookie)).body.analyses.length,0);
  assert.equal((await request('/api/workspace',null,manager.cookie)).body.analyses[0].id,analysis.body.id);
  assert.equal((await request('/api/auth',{login:email,password:'incorrect-password'})).status,401);
  assert.equal((await request('/api/auth',{action:'logout'},winner.cookie)).status,200);
  assert.equal((await request('/api/workspace',null,winner.cookie)).status,401);
  console.log('PASS: cadastro, perfis, cookies seguros, sessão única sequencial e concorrente, restrições, histórico e logout.');
} finally {
  for (const id of ids.reverse()) await sql.query('DELETE FROM users WHERE id=$1',[id]);
  console.log('Contas temporárias de teste removidas.');
}
