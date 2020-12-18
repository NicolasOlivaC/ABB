var express = require('express');
var router = express.Router();
var con = require('../mysqlcon');
var { isLoggedIn, isPM, isEL } = require('../public/lib/out')
var helpers = require('../public/lib/helpers')



router.get('/reposicion', isLoggedIn, isPM, async function(req,res, next) {
    var row = await con.query('SELECT tipo FROM users WHERE rut_users = ?', req.session.passport.user)
    con.query('SELECT * FROM inventario WHERE stock_minimo > stock', (err, inventario) =>{
       res.render('PM/ingresarReposicion', {
            title: 'Gestionar productos',
            tipo: row[0].tipo,
            data: inventario,
            mensaje2: req.flash('mensaje2')
           });
    })
    
           
  });

  router.post('/ingresarRegistro', isLoggedIn, isPM, async(req, res) => {

    const data=req.body;
      con.query('INSERT INTO reposiciones set ?', [data], (err, resultado) =>{
        console.log(resultado)
        if(resultado){
          if(resultado.affectedRows==1){
            req.flash('mensaje2', 'Solicitud generada exitosamente');
            res.redirect('/reposicion');
          }
          else{
            req.flash('mensaje2', 'Solicitud no generada');
            res.redirect('/reposicion');
          }
        }
  
        else{
          req.flash('mensaje2', 'Solicitud no generada') 
          res.redirect('/reposicion');
        }
      })
    })






  module.exports = router;
