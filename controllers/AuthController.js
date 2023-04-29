const User = require('../models/User')

const bcrypt = require('bcryptjs')

module.exports = class AuthController {
    static login(req, res) {
        res.render('auth/login')
    }

    static async loginPost(req, res){
        const {email, password} = req.body

        const user = await User.findOne({where: {email: email}})
        if(!user){
            req.flash('message', 'Email não cadastrado!')
            res.render('auth/login')
            return
        }

        const passwordMatch = bcrypt.compareSync(password, user.password)
        if(!passwordMatch){
            req.flash('message', 'Senha incorreta!')
            res.render('auth/login')
            return
        }

        req.session.userid = user.id
        req.flash('message', 'Logado!')
        req.session.save(() => {
            res.redirect('/')
        })
    }

    static register(req, res) {
        res.render('auth/register')
    }

    static async registerPost(req, res){
        const {name, email, password, confirmpassword} = req.body

        if(password != confirmpassword) {
            req.flash('message', 'As senhas não conferem, tente novamente!')
            res.render('auth/register')
            return
        }

        const checkUserExists = await User.findOne({where: {email: email}})

        if(checkUserExists) {
            req.flash('message', 'Email já cadastrado!')
            res.render('auth/register')
            return
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPasssword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPasssword
        }
        try {
            const createdUser = await User.create(user)
            req.session.userid = createdUser.id
            req.flash('message', 'Cadastro realizado com sucesso!')
            req.session.save(() => {
                res.redirect('/')
            })
        } catch (err) {
            console.log(err)
        }
    }

    static logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }
}