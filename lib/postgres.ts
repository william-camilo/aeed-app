import { neon, types, type NeonQueryFunction } from '@neondatabase/serverless';

type Value = string | number | boolean | null;
type Client = NeonQueryFunction<false, false>;
// Our bigint columns store JavaScript millisecond timestamps and counts.
types.setTypeParser(20, value => Number(value));

// The app's existing parameterized queries use ?. Values are always sent
// separately to Postgres; they are never interpolated into SQL.
function placeholders(query: string) {
  let index = 0;
  return query.replace(/'(?:[^']|'')*'|\?/g, token => token === '?' ? `$${++index}` : token);
}

class Statement {
  constructor(readonly client: Client, readonly text: string, readonly values: Value[] = []) {}
  bind(...values: Value[]) { return new Statement(this.client, this.text, values); }
  query() { return this.client.query(placeholders(this.text), this.values); }
  async first<T = Record<string, unknown>>(): Promise<T | null> {
    const rows = await this.query();
    return (rows[0] as T | undefined) ?? null;
  }
  async all() { return { results: await this.query() }; }
  async run() { await this.query(); return { success: true }; }
}

let instance: ReturnType<typeof createDatabase> | undefined;
function createDatabase(url: string) {
  const client = neon(url);
  return {
    prepare(query: string) { return new Statement(client, query); },
    // Session replacement must commit as one transaction. Locking the user
    // with the first UPDATE serializes simultaneous logins for that account.
    async batch(statements: Statement[]) {
      return client.transaction(statements.map(statement => statement.query()));
    },
  };
}

export function postgresDatabase() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('Banco indisponível. Tente novamente em instantes.');
  return instance ??= createDatabase(url);
}
