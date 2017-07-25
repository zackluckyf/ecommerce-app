const { Pool, Client } = require('pg')

const CONNECTIONSTRING = process.env.DATABASE_URL;

let pool;

if(process.env.HEROKU){
    pool = new Pool({
        connectionString: CONNECTIONSTRING,
    });
} else {
    pool = new Pool({
        user: 'zackfanning',
        host: 'localhost',
        database: 'social_network',
        password: 'harrier',
        port: 5432,
    });
}

let getFirstUser = async (userId: number) => {
    const client = await pool.connect();
    try {
        let res = pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        return res;
    } catch(e) {
        e => console.log(e.stack)
    } finally {
        client.release();
    }
}

module.exports = {
  getFirstUser: getFirstUser
};