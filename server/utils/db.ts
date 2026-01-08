import postgres from 'postgres'

let config = useRuntimeConfig()

const sql = postgres(`postgres://${config.dbUser}:${config.dbPassword}@${config.dbURL}/${config.dbName}`)


export default sql