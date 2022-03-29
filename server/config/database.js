import Sequelize from 'sequelize';
import { Config } from './config'

let pool = {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
}

let config = new Config('localhost', 'root', 'root', 'testdb', 'mysql', pool)

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