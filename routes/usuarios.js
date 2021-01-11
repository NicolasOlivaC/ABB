var express = require('express');
var router = express.Router();
var con = require('../mysqlcon');
var { isLoggedIn, isPM, isEL } = require('../public/lib/out')
var helpers = require('../public/lib/helpers')


router.get('/gestionUsuarios', isLoggedIn, isPM, async function(req,res, next) { 
  var row = await con.query('SELECT tipo FROM users WHERE rut_users = ?', req.session.passport.user)  
  con.query("SELECT * FROM users", (err, motores) => {
    	//console.log(motores)
      if (err) {
        res.json(err);
      }
      res.render('PM/gestionUsuario', {
        title: 'Gestión de usuarios',
        data: motores,
        tipo: row[0].tipo,
        mensaje2: req.flash('mensaje2'),
 
      });
    });
  });

  router.post('/signup2', isLoggedIn, isPM, async function(req, res, next) {
    var { name, rutadd, email, tipo } = req.body
    var password = "pepito123";
    password = await helpers.encryptPassword(password);
    await con.query('INSERT INTO users SET name = ?, rut_users = ?, email = ?, tipo = ?, password = ?', [name, rutadd, email, tipo, password], (err, resultado) =>{
      console.log(resultado)
      if(resultado){
        if(resultado.affectedRows==1){
          req.flash('mensaje2', 'SE HA AÑADIDO EL USUARIO CORRECTAMENTE');
         
          res.redirect('/gestionUsuarios');
        }
        else{
          req.flash('mensaje2', 'NO SE HA PODIDO AÑADIR EL USUARIO');
          res.redirect('/gestionUsuarios');
        }
      }
    
      else{
        req.flash('mensaje2', 'NO SE HA PODIDO AÑADIR EL USUARIO')
        res.redirect('/gestionUsuarios');
      }  
    })
  })


  router.post('/modusuario', isLoggedIn, isPM, async function(req, res, next) {
    var { name, rut_users, email, tipo } = req.body
    await con.query('UPDATE users SET name = ?, email = ?, tipo = ? WHERE rut_users = ?', [name, email, tipo, rut_users], (err, resultado) =>{
      if(resultado){
        if(resultado.affectedRows==1){
          req.flash('mensaje2', 'USUARIO MODIFICADO EXITOSAMENTE.');
         
          res.redirect('/gestionUsuarios');
        }
        else{
          req.flash('mensaje2', 'NO SE HA PODIDO MODIFICAR EL USUARIO');
          res.redirect('/gestionUsuarios');
        }
      }
    
      else{
        req.flash('mensaje2', 'NO SE HA PODIDO MODIFICAR EL USUARIO')
        res.redirect('/gestionUsuarios');
      }  

    })
    
  })

  router.post('/deleteusuario', isLoggedIn, isPM, async function(req, res, next) {
    var { rutdel } = req.body
    await con.query('DELETE FROM users WHERE rut_users = ?', rutdel, (err, resultado) =>{
      if(resultado){
        console.log(resultado)
        if(resultado.affectedRows==1){
          req.flash('mensaje2', 'USUARIO ELIMINADO EXITOSAMENTE');
         
          res.redirect('/gestionUsuarios');
        }
        else{
          req.flash('mensaje2', 'NO SE HA PODIDO ELIMINAR EL USUARIO');
          res.redirect('/gestionUsuarios');
        }
      }
    
      else{
        req.flash('mensaje2', 'NO SE HA PODIDO ELIMINAR EL USUARIO')
        res.redirect('/gestionUsuarios');
      }     
    })
  })


  router.get('/deleteusuario2/:id', (req,res) =>{ 
    const {id} = req.params;
    if(id != req.user.id_users){
      con.query('DELETE FROM users WHERE id_users = ?', id, (err, resultado) =>{  
        console.log(resultado)
        res.redirect('/gestionUsuarios');  
      })
    }
    else{
      res.redirect('/gestionUsuarios');
    }
        
  });


/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});

module.exports = router;
