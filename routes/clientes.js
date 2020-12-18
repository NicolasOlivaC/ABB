var express = require('express');
var router = express.Router();
var con = require('../mysqlcon');
var { isLoggedIn, isPM, isEL } = require('../public/lib/out')

router.get('/clientes', isLoggedIn, isEL, async function(req,res, next) {  //kk _ Toda la informacion de un heroe en especifico.
  var row = await con.query('SELECT tipo FROM users WHERE rut_users = ?', req.session.passport.user)
    con.query("SELECT * FROM clientes", (err, clientes) => {
      if (err) {
        res.json(err);
      }
      res.render('EL/clientes', {
        title: 'Clientes',
        data: clientes,
        tipo: row[0].tipo,
        mensaje7: req.flash('mensaje7'),
        mensaje8: req.flash('mensaje8'),
        mensaje9: req.flash('mensaje9')
      });
    });
});

router.post('/addCliente', isLoggedIn, isEL, async(req, res) => {

  const data=req.body;
    con.query('INSERT INTO clientes SET rut_clientes = ?, nombre = ?, empresa = ?, telefono = ?, email = ?', [data.RUT, data.name, data.empresa, data.telefono, data.email], (err, resultado) =>{
      if(!resultado){
        console.log("test");
        req.flash('mensaje8', 'El CLIENTE NO SE HA PODIDO AGREGAR');
        res.redirect('/clientes');
      }
      req.flash('mensaje8', 'EL CLIENTE SE HA AGREGADO CON ÉXITO');
      res.redirect('/clientes');
    })
  })

router.post('/modcliente', isLoggedIn, isEL, async function(req, res, next) {
  var { name, rut_clientes, email, telefono, empresa } = req.body
  console.log(name + ' ' + rut_clientes + ' ' + email + ' ' + telefono + ' ' + empresa);
  await con.query('UPDATE clientes SET nombre = ?, email = ?, telefono = ?, empresa = ? WHERE rut_clientes = ?', [name, email, telefono, empresa, rut_clientes], (err, resultado) =>{
    if(resultado){
      if(resultado.affectedRows==1){
        req.flash('mensaje7', 'USUARIO MODIFICADO EXITOSAMENTE.');
       
        res.redirect('/clientes');
      }
      else{
        req.flash('mensaje7', 'NO SE HA PODIDO MODIFICAR EL USUARIO');
        res.redirect('/clientes');
      }
    }
  
    else{
      req.flash('mensaje7', 'NO SE HA PODIDO MODIFICAR EL USUARIO')
      res.redirect('/clientes');
    }  

  })
  
})

router.post('/deleteCliente', isLoggedIn, isEL, async (req, res) => {
  var row = await con.query('SELECT tipo FROM users WHERE rut_users = ?', req.session.passport.user)
  const data=req.body;
  console.log("test");
    con.query('DELETE FROM clientes WHERE rut_clientes = ?', [data.RUT] , (err, resultado) =>{
      if(resultado){
        if(resultado.affectedRows == 1){
          req.flash('mensaje9', 'EL CLIENTE SE HA ELIMINADO CORRECTAMENTE');
          res.redirect('/clientes');
        }
        else{
          req.flash('mensaje9', 'EL CLIENTE NO SE HA PODIDO ELIMINAR');
          res.redirect('/clientes');
        }
      }
        
        else{

          req.flash('mensaje9', 'EL CLIENTE NO SE HA PODIDO ELIMINAR');
          res.redirect('/clientes');
        }

  })
})


module.exports = router;