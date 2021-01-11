var express = require('express');
var router = express.Router();
var con = require('../mysqlcon');
var { isLoggedIn, isNotLoggedIn, isPM, isEL } = require('../public/lib/out')


router.get('/ingresarRegistroVenta', isLoggedIn, isEL, async function(req,res, next) {
  var row = await con.query('SELECT tipo FROM users WHERE rut_users = ?', req.session.passport.user)
   
      res.render('EL/ingresarRegistroVenta', {
        title: 'Nuevo registro de venta',
        tipo: row[0].tipo,
        mensaje4: req.flash('mensaje4')
      });
});


router.post('/createVenta', isLoggedIn, isEL, async (req, res) => {
  const data=req.body;
  var inventario = await con.query('SELECT * FROM inventario WHERE motores_catalog_number = ?', data.catalog_number)
  if(typeof inventario[0] !== 'undefined'){
    if(inventario[0].stock < data.cantidad){
      req.flash('mensaje4', 'No se ha podido ingresar el registro: el stock es menor a la cantidad asignada.');
      res.redirect('/ingresarRegistroVenta');
    }else{
      var cant = inventario[0].stock - data.cantidad;
      await con.query('UPDATE inventario SET stock = ? WHERE motores_catalog_number = ?', [cant, data.catalog_number]);
      await con.query("INSERT INTO ventas SET fecha = ? , rut_el = ?, rut_cliente = ?", [data.fecha, data.rut_encargado, data.rut_cliente])
      var id_venta = await con.query('SELECT * FROM ventas ORDER BY id_ventas DESC LIMIT 0, 1');
      await con.query('INSERT INTO detalle_ventas SET id_ventas = ?, motores_catalog_number = ?, cantidad = ?, pago_usd = ?, fecha = ?', [id_venta[0].id_ventas, data.catalog_number, data.cantidad, data.precio, data.fecha]);
      req.flash('mensaje4', 'Se ha agregado el registro de venta satisfactoriamente');
      res.redirect('/ingresarRegistroVenta');
    }
  }else{
    req.flash('mensaje4', 'El catalog number no se ha encontrado en el inventario');
    res.redirect('/ingresarRegistroVenta');
  }
})



router.get('/eliminarRegistroVenta', isLoggedIn, isEL, async function(req,res, next) { 
  var row = await con.query('SELECT tipo FROM users WHERE rut_users = ?', req.session.passport.user)
    con.query("SELECT * from inventario, motores where motores.catalog_number = inventario.motores_catalog_number", (err, motores) => {

      if (err) {
        res.json(err);
      }
      res.render('EL/eliminarRegistroVenta', {
        title: 'Eliminar registro',
        data: motores,
        tipo: row[0].tipo,
        mensaje5: req.flash('mensaje5')
      });
    });
});


router.post('/deleteRegistroVenta', isLoggedIn, isEL, async (req, res) => {

  const data=req.body;
  await con.query('DELETE FROM ventas WHERE ?', [data] , (err, resultado) =>{
    console.log(resultado)
    if(resultado){
      if(resultado.affectedRows==1){
        req.flash('mensaje5', 'Se ha eliminado el registro de venta');
        res.redirect('/eliminarRegistroVenta');
      }
      else{
        req.flash('mensaje5', 'Error al eliminar el registro de venta');
        res.redirect('/eliminarRegistroVenta');
      }
    }
      else{
      req.flash('mensaje5', 'Error al eliminar el registro de venta')
      res.redirect('/eliminarRegistroVenta');
    }  
  })
})

router.get('/modificarRegistroVenta', isLoggedIn, isEL, async function(req,res, next) { 
  var row = await con.query('SELECT tipo FROM users WHERE rut_users = ?', req.session.passport.user)
    con.query("SELECT * from ventas", (err, motores) => {

      if (err) {
        res.json(err);
      }
      res.render('EL/modificarRegistroVenta', {
        title: 'Modificar registro',
        data: motores,
        tipo: row[0].tipo
      });

    });ñ
});

router.get('/consultarRegistroVenta', isLoggedIn, isEL, async function(req,res, next) { 
  var row = await con.query('SELECT tipo FROM users WHERE rut_users = ?', req.session.passport.user)
    con.query("SELECT v.id_ventas, v.rut_el, v.rut_cliente, dv.motores_catalog_number, dv.cantidad, dv.pago_usd, dv.fecha FROM ventas AS v, detalle_ventas AS dv WHERE dv.id_ventas = v.id_ventas", (err, d_ventas) => {

      res.render('EL/consultarRegistroVenta', {
        title: 'Consultar registro',
        data: d_ventas,
        tipo: row[0].tipo
      });

    });
});

module.exports = router;
