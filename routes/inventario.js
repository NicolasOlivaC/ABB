var express = require('express');
var router = express.Router();
var con = require('../mysqlcon');
var { isLoggedIn, isPM, isEL } = require('../public/lib/out')

//<<<<< CONSULTA QUE UTILIZAMOS EN LA VERSION ORIGINAL >>>>>>>
// router.get('/gestionInventario', isLoggedIn, isPM, async function(req,res, next) {
//   var row = await con.query('SELECT tipo FROM users WHERE rut_users = ?', req.session.passport.user)
//   con.query("SELECT * from inventario, motores where motores.catalog_number = inventario.motores_catalog_number", (err, motores) => {

//       if(motores){
//         var contenidoMensaje = "Inventario obtenido exitosamente";
//       }
//       else{
//         var contenidoMensaje = "No se ha podido obtener el inventario";
//       }

//       res.render('PM/gestionInventario', {
//         title: 'Gestión de inventario',
//         data: motores,
//         tipo: row[0].tipo,
//         mensaje: req.flash('mensaje'),
//         mensaje2: contenidoMensaje
//       });

//     });
// });

router.get('/gestionInventario', isLoggedIn, isPM, async function (req, res, next) {
  var row = await con.query('SELECT tipo FROM users WHERE rut_users = ?', req.session.passport.user)
  con.query("SELECT * from inventario, motores where motores.catalog_number = inventario.motores_catalog_number")
    .then((resultadoInventario) => {
      res.render('PM/gestionInventario', {
        title: 'Gestión de inventario',
        data: resultadoInventario,
        tipo: row[0].tipo,
        mensaje: req.flash('mensaje')
      });
    })
    .catch((errores) => {
      res.redirect('/gestionInventario');
    })
});

//<<<<< CONSULTA QUE UTILIZAMOS EN LA VERSION ORIGINAL >>>>>>>
// router.post('/updateStock', isLoggedIn, isPM, async (req, res) => {
//     const data=req.body;
//     con.query('UPDATE inventario set stock = ?, stock_minimo = ? WHERE  motores_catalog_number = ? ', [data.stock,data.stock_minimo ,data.motores_catalog_number] , (err, resultado) =>{

//       if(resultado){
//         if(resultado.affectedRows==1){
//           req.flash('mensaje', 'El Stock se ha modificado correctamente');
//           res.redirect('/gestionInventario');
//         }
//         else{
//           req.flash('mensaje', 'El Stock no se ha podido modificar');
//           res.redirect('/gestionInventario');
//         }
//       }

//       else{
//         req.flash('mensaje', 'El Stock no se ha podido modificar');
//         res.redirect('/gestionInventario');
//       }
//   })
// })

router.post('/updateStock', isLoggedIn, isPM, async (req, res) => {
  const data = req.body;
  con.query('UPDATE inventario set stock = ?, stock_minimo = ? WHERE  motores_catalog_number = ? ', [data.stock, data.stock_minimo, data.motores_catalog_number])
    .then((resultadoUpdate) => {
      req.flash('mensaje', `El stock del motor "${data.motores_catalog_number}" se ha modificado correctamente`);
      res.redirect('/gestionInventario');
    })
    .catch((error) => {
      req.flash('mensaje', `El stock del motor "${data.motores_catalog_number}" no se ha podido modificar`);
      res.redirect('/gestionInventario');
    })
})


module.exports = router;
