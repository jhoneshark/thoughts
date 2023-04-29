const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('','','', {
    host:'',
    dialect: '',
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
