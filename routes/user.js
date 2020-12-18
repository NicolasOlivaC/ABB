var express = require('express');
var router = express.Router();
var passport = require('passport');
var con = require('../mysqlcon');
var { isLoggedIn, isNotLoggedIn } = require('../public/lib/out');
var helpers = require('../public/lib/helpers')

router.get('/signup', isNotLoggedIn, function(req, res, next) {
    res.render('signup', { title: 'Página de registro' });
});
router.get('/login', isNotLoggedIn, function(req, res, next) {
    res.render('login', { title: 'Inicio de sesion'});
});
router.post('/signup', isNotLoggedIn, async (req, res)=>{
    var { fullname, username, email, tipo, password } = req.body
    password = await helpers.encryptPassword(password);
    await con.query('INSERT INTO users set rut_users = ?, name = ?, email = ?, tipo = ?, password = ?', [username, fullname, email, tipo, password]);
    res.redirect('/login');
})

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut()
    tipo = '';
    res.redirect('/')
})

router.get('/adios', isNotLoggedIn, (req,res) => {
    res.render('adios', {title: 'Hasta luego'})
})

router.get('/cambiarClave', isLoggedIn, async(req, res) => {
    var row = await con.query('SELECT tipo FROM users WHERE rut_users = ?', req.session.passport.user)
    res.render('cambiarClave', { title: 'Cambiar contraseña', tipo: row[0].tipo, mensaje4: req.flash('mensaje4')})
})

router.post('/cambiarClave', isLoggedIn, async (req, res) => {
    var { actpassword, neopassword, neopassworddos } = req.body;
    if(actpassword == neopassword){
        req.flash('mensaje4', 'Ha habido un error en modificar la contraseña. La nueva contraseña no puede ser igual a la actual.');
        res.redirect('/cambiarClave');
    }else{
        var usuario = await con.query('SELECT * FROM users WHERE rut_users = ?', req.session.passport.user);
        console.log(await helpers.matchPassword(actpassword, usuario[0].password));
        if(await helpers.matchPassword(actpassword, usuario[0].password)){
            if(neopassword == neopassworddos){
                neopassword = await helpers.encryptPassword(neopassword);
                con.query('UPDATE users SET password = ? WHERE rut_users = ?', [neopassword, req.session.passport.user]);
                var nodemailer = require('nodemailer');

                //Creamos el objeto de transporte
                var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'doneduardodemepractica@gmail.com',
                    pass: 'doneduardo123'
                }
                });
                var mensaje = "Estimado/a " + usuario[0].name + ", ha habido un cambio en la contraseña de acceso de su cuenta ABB. Si no fue ud. quien realizó el cambio, contáctese inmediatamente con el Product Manager.";
                
                var mailOptions = {
                from: 'doneduardodemepractica@gmail.com',
                to: usuario[0].email,
                subject: 'Cambio de contraseña efectuado',
                text: mensaje
                };
                
                transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email enviado: ' + info.response);
                }
                });

                req.flash('mensaje4', 'La contraseña se ha modificado exitosamente');
                res.redirect('/cambiarClave');
            }else{
                req.flash('mensaje4', 'Ha habido un error en modificar la contraseña. Asegúrese de que los dos campos de la nueva contraseña coincidan.');
                res.redirect('/cambiarClave');
            }
        }else{
            req.flash('mensaje4', 'Ha habido un error en modificar la contraseña. La contraseña actual no coincide.');
            res.redirect('/cambiarClave');
        }
    }
})

module.exports = router;
