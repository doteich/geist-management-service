import sql from '../utils/db'

export default defineNitroPlugin(async () => {
  try {
    const config = useRuntimeConfig()

    console.log('Checking database schema...')

    await sql`
      CREATE TABLE IF NOT EXISTS ${sql(config.dbTableName)} (
        uid bigserial NOT NULL,
        name text NOT NULL,
        host text NOT NULL,
        namespace text NOT NULL,
        workflow text NOT NULL,
        kube_version text NOT NULL,
        PRIMARY KEY (uid),
        CONSTRAINT url_edge_unique UNIQUE (url),
        CONSTRAINT name_edge_unique UNIQUE (name)
      );
    `


    await sql`ALTER TABLE ${sql(config.dbTableName)} OWNER TO ${sql(config.dbUser)};`

    console.log('Database schema is ready.')
  } catch (err) {
    console.error('Database initialization failed:', err)
  }
})