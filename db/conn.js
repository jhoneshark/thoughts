const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('taplfzln','taplfzln','jCYeK0AsgBLBOmvM2e-ZE1Zl8FQ8GAiM', {
    host:'babar.db.elephantsql.com',
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
})

try {
    sequelize.authenticate();
    console.log(`Conectado com sucesso`)
} catch (error) {
    console.log(`Nao foi possivel conectar: ${error}`)
}

module.exports = sequelize