var express = require('express');
var router = express.Router();
var passport = require('passport');
var con = require('../mysqlcon');
var { isLoggedIn, isNotLoggedIn } = require('../public/lib/out');
var helpers = require('../public/lib/helpers')

router.get('/resetclave', isNotLoggedIn, (req, res)=>{
    res.render('resetclave', { title: 'Recuperar contraseña', mensaje4: req.flash('mensaje4') })
})

router.post('/resetclave', isNotLoggedIn, async (req, res)=>{
    var { email } = req.body
    var user = await con.query('SELECT * FROM users WHERE email = ?', email, async (err, user) =>{
        if(user.length > 0){
            var nodemailer = require('nodemailer');

            //Creamos el objeto de transporte
            var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'doneduardodemepractica@gmail.com',
                pass: 'doneduardo123'
            }
            });
            var password = "pepito123";
            password = await helpers.encryptPassword(password);
            con.query('UPDATE users SET password = ? WHERE email = ?', [password, user[0].email]);
            var mensaje = "Su clave ahora es pepito123. Ingrese con su cuenta y acceda al enlace de ''Cambiar contraseña'', que se muestra al hacer click en el ícono de arriba a la izquierda de su interfaz, para seleccionar una nueva contraseña.";
            
            var mailOptions = {
            from: 'doneduardodemepractica@gmail.com',
            to: user[0].email,
            subject: 'Reinicio de contraseña',
            text: mensaje
            };
            
            transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email enviado: ' + info.response);
            }
            });
            req.flash('mensaje4', 'Proceso exitoso. La nueva contraseña ha sido enviada al email.');
         
            res.redirect('/resetclave');
        }else{
            req.flash('mensaje4', 'El email ingresado no figura en la base de datos.');
         
            res.redirect('/resetclave');
        }
    })

    
})

module.exports = router;