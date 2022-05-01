import Sequelize, { json } from 'sequelize';
import { Config } from './config';
import * as fs from 'fs';

const configPath = '/home/ec2-user/config/db.json';

let pool = {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
}
let config = new Config('localhost', 'root', 'root', 'testdb', 'mysql', pool)
if (fs.existsSync(configPath)) {
    let jsonString = fs.readFileSync(configPath, {
        encoding: 'utf-8'
    });
    const dbConfig = JSON.parse(jsonString);
    config = new Config(dbConfig.host, dbConfig.user, dbConfig.password, dbConfig.database, 'mysql', pool)
}



const sequelize = new Sequelize(
    config.db,
    config.user,
    config.password,
    {
        host: config.host,
        dialect: config.dialect,
        pool: config.pool,
        operatorsAliases: false,
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);

// sequelize.sync({ force: true }).then(() => {
//     console.log('Drop and Resync Database with { force: true }');
// });
export default sequelize;