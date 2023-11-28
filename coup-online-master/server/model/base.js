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
            user: 'postgres',
            host: '172.18.0.2',
            database: 'mydb',
            password: "1234",
            port: 5432,
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
        try {
            await this.#client.query(`INSERT INTO ${table}(${field}) VALUES('${value}');`);   
        } catch (error) {
            console.error("\nInsertInto", `Error: ${error.message}`);
        } finally {
            this.#client.release();
        }
    }

    async insertBatchInto(table, field, value) {
        try {
            const valuesNormalized = value.reduce((acc, v) => acc += `'${v}',`, ``);

            await this.#client.query(`INSERT INTO ${table}(${field.toString()}) VALUES(${valuesNormalized.slice(0, valuesNormalized.length - 1)});`);
        } catch (error) {
            console.error("\nInsertBatchInto", `Error: ${error.message}`);
        } finally {
            this.#client.release();
        }
    }

    async selectFrom(table, field) {
        console.log(await this.#client.query(`SELECT ${field} FROM ${table};`));
        this.#client.release();
    }
}

module.exports = DataBase;