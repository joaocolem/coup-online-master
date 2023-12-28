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

    async selectFrom(table, field = '*', where, data) {
        const query = `
            SELECT ${field}
            FROM ${table}
            ${ where && data ? `WHERE ${where} = '${data}'` : ``};
        `;

        return await this.#pool.query(query)?.rows;
    }
}

module.exports = DataBase;