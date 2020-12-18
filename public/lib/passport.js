const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const pool = require('../../mysqlcon')
const helpers = require('./helpers.js')

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    console.log(req.body)
    const rows = await pool.query('SELECT * FROM users WHERE rut_users = ?', [username])
    if(rows.length > 0){
        const user = rows[0]
        const validPassword = await helpers.matchPassword(password, user.password)
        if(validPassword){
            done(null, user, req.flash('message', 'Se ha iniciado sesión correctamente. Hola ' + user.name))
            console.log('contraseña correcta')
        }else{
            done(null, false, req.flash('message', 'Contraseña inválida'))
            console.log('contraseña incorrecta')
        }
    }else{
        console.log('RUT incorrecto')
        return done(null, false, req.flash('message', 'El rut ingresado no existe en la base de datos'))
    }
}))

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { fullname, email, tipo } = req.body
    const newUser = {
        username,
        password,
        fullname,
        email,
        tipo
    }

    newUser.password = await helpers.encryptPassword(password)
    const result = await pool.query("INSERT INTO users (rut_users, name, email, password, tipo) VALUES (" +newUser.username+", '" +newUser.fullname+"', '"+newUser.email+"','"+newUser.password+"', '"+newUser.tipo+"')");
    newUser.id = result.insertId
    console.log(newUser);
    return done(null, newUser)
}))

passport.serializeUser((user, done) => {
    done(null, user.rut_users)
})

passport.deserializeUser(async (rut_users, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE rut_users = ?', [rut_users])
    done(null, rows[0])
})
