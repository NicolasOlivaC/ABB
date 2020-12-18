var express = require('express');
var router = express.Router();
var con = require('../mysqlcon');
var { isLoggedIn, isPM, isEL } = require('../public/lib/out')


router.get('/gestionInventario', isLoggedIn, isPM, async function(req,res, next) {  //kk _ Toda la informacion de un heroe en especifico.
  var row = await con.query('SELECT tipo FROM users WHERE rut_users = ?', req.session.passport.user)
  con.query("SELECT * from inventario, motores where motores.catalog_number = inventario.motores_catalog_number", (err, motores) => {

      if(motores){
        var contenidoMensaje = "Inventario obtenido exitosamente";
      }
      else{
        var contenidoMensaje = "No se ha podido obtener el inventario";
      }

      res.render('PM/gestionInventario', {
        title: 'Gestión de inventario',
        data: motores,
        tipo: row[0].tipo,
        mensaje: req.flash('mensaje'),
        mensaje2: contenidoMensaje
      });

    });
});



router.post('/updateStock', isLoggedIn, isPM, async (req, res) => {
    const data=req.body;
    con.query('UPDATE inventario set stock = ?, stock_minimo = ? WHERE  motores_catalog_number = ? ', [data.stock,data.stock_minimo ,data.motores_catalog_number] , (err, resultado) =>{

      if(resultado){
        if(resultado.affectedRows==1){
          req.flash('mensaje', 'El Stock se ha modificado correctamente');
          res.redirect('/gestionInventario');
        }
        else{
          req.flash('mensaje', 'El Stock no se ha podido modificar');
          res.redirect('/gestionInventario');
        }
      }
    
      else{
        req.flash('mensaje', 'El Stock no se ha podido modificar');
        res.redirect('/gestionInventario');
      }
  })
})



/* GET home page. */
//router.get('/inventario', function(req, res, next) {
//  res.render('inventario', { title: 'Express' });
//});

module.exports = router;
