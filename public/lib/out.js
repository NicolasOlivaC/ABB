var con = require('../../mysqlcon');

module.exports = {
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        return res.redirect('/login')
    },
    isNotLoggedIn(req,res,next){
        if (req.isAuthenticated()) {
            return res.redirect('/')
        }else{
            return next()
        }
    },
    async isPM(req, res, next){
        var row = await con.query('SELECT * FROM users WHERE rut_users = ?', req.session.passport.user)
        console.log(row[0].tipo)
        if (row[0].tipo == 'PM'){
            console.log('es pm supongo no c ojalá funcione')
            return next()
        }else{
            if(req.url == '/'){
                req.flash('message', 'Se ha iniciado sesión correctamente. Hola ' + row[0].name)
                return res.redirect('/indexEL')
            }
            console.log('parece qjue no es pm puee ser')
            req.flash('mensaje4', 'Esta vista es exclusiva para Product Manager')
            return res.redirect('/indexEL')
        }
    },
    async isEL(req, res, next){
        var row = await con.query('SELECT tipo FROM users WHERE rut_users = ?', req.session.passport.user)
        console.log(row[0].tipo)
        if(row[0].tipo == 'EL'){
            return next()
        }else{
            req.flash('mensaje4', 'Esta vista es exclusiva para Encargado de Logística')
            return res.redirect('/')
        }
    }
}
