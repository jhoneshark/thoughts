const { Sequelize } = require('sequelize');
const env = require('../index');

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
    host: env.DB_HOST,
    dialect: env.DB_DIALECT,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: env.DB_SSL === 'true'
        }
    }
});

try {
    sequelize.authenticate();
    console.log(`Conectado com sucesso`)
} catch (error) {
    console.log(`Não foi possível conectar: ${error}`)
}

module.exports = sequelize;
