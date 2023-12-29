const pg = require('pg');

const helper = require('./baseHelper.js');
const { Pool } = pg;

class DataBase{
    #pool;

    constructor() {    
        this.#pool = new Pool({
            host: process.env.PGHOST,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
        });

        this.#pool.on('error', (err, _) => {
            console.error('Error on Pool', err);
            process.exit(-1);
        });
    }

    async shutdown() {
        await this.#pool.end();
    }

    async insertInto(table, field, value) {
        const valuesNormalized = helper.normalizeValue(value);
        const query = `
            INSERT INTO ${table}(${field.toString()}) 
            VALUES(${valuesNormalized});
        `;

        return await this.#pool.query(query);
    }

    async selectFrom(table, field = '*', where) {
        const query = `
            SELECT ${field}
            FROM ${table}
            ${ where && `WHERE ${where};`}
        `;

        const res = await this.#pool.query(query);
        return res.rows[0];
    }

    async update(table, field, where, data) {
        const query=`
            UPDATE ${table}
            SET ${field} = ${data}
            WHERE ${where};
        `

        return await this.#pool.query(query);
    }
}

module.exports = DataBase;