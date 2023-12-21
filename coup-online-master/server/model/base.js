const pg = require('pg');

const { Pool } = pg;

class DataBase{
    #pool;
    #client;

    constructor() {    
        this._init();
    }

    async _init() {
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
    
    async connect() {
        this.#client = await this.#pool.connect();
    }

    async shutdown() {
        await this.#pool.end();
    }

    async insertInto(table, field, value) {
        let response;

        try {
            const valuesNormalized = value.reduce((acc, v) => acc += `'${v}',`, ``);
            const query = `
                INSERT INTO ${table}(${field.toString()}) 
                VALUES(${valuesNormalized.slice(0, valuesNormalized.length - 1)});
            `;

            response = {
                success: true, 
                content: await this.#client.query(query),
            };

        } catch (error) {
            response = {
                success: false,
                error: error,
            };

        } finally {
            this.#client.release();
        }

        return response;
    }

    async selectFrom(table, field = '*', where, data) {
        const query = `
            SELECT ${field}
            FROM ${table}
            ${ where && data ? `WHERE ${where} = '${data}'` : ``};
        `;
        let response;

        try {
            response = await this.#client.query(query);
        } catch (error) {
            console.error("\nSelectFrom", `Error: ${error.message}`);
        } finally {
            this.#client.release();
        }

        return await response?.rows;
    }
}

module.exports = DataBase;