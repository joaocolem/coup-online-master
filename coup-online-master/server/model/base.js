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
            host: '172.17.0.2',
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
        console.log(await this.#client.query(`INSERT INTO ${table}(${field}) VALUES('${value}');`));
        this.#client.release();
    }

    async selectFrom(table, field) {
        console.log(await this.#client.query(`SELECT ${field} FROM ${table};`));
        this.#client.release();
    }
}

module.exports = DataBase;