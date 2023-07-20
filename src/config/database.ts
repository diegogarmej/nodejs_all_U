import { knex } from 'knex'
import dotenv  from 'dotenv'

dotenv.config()

export const db = knex({
    client: 'pg',
    connection: {
        host: 'localhost',
        port: 9190,
        database: 'gestion_citas',
        user: 'root',
        password: 'root',
    },
})

export default db