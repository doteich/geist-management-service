import sql from '../utils/db'

export default defineNitroPlugin(async () => {
  try {
    console.log('Checking database schema...')
    
    // Execute your table creation
    await sql`
      CREATE TABLE IF NOT EXISTS public."edge-instances" (
        uid bigserial NOT NULL,
        name text NOT NULL,
        url text NOT NULL,
        namespace text NOT NULL,
        workflow text NOT NULL,
        kube_version text NOT NULL,
        PRIMARY KEY (uid),
        CONSTRAINT url_unique UNIQUE (url),
        CONSTRAINT name_unique UNIQUE (name)
      );
    `

    // Note: Use sql.unsafe for dynamic identifiers like OWNER TO
    // because standard template literals parameterize values, not identifiers.
    const config = useRuntimeConfig()
    await sql`ALTER TABLE public."edge-instances" OWNER TO ${sql(config.dbUser)};`

    console.log('Database schema is ready.')
  } catch (err) {
    console.error('Database initialization failed:', err)
  }
})