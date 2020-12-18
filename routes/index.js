var express = require('express');
var router = express.Router();
var con = require('../mysqlcon');
var { isLoggedIn, isNotLoggedIn, isPM, isEL } = require('../public/lib/out');



router.get('/', isLoggedIn, isPM , async function(req,res, next) {  //kk _ Toda la informacion de un heroe en especifico.
  var row = await con.query('SELECT tipo FROM users WHERE rut_users = ?', req.session.passport.user)
    con.query("SELECT * FROM motores", (err, motores) => {
    	//console.log(motores)
      if (err) {
        res.json(err);
      }
      res.render('index', {
        title: 'Product Manager',
        data: motores,
        tipo: row[0].tipo,
        mensaje4: req.flash('mensaje4')
      });

    });
  });

  router.get('/indexEL', isLoggedIn, isEL , async function(req,res, next) {  //kk _ Toda la informacion de un heroe en especifico.
    var row = await con.query('SELECT tipo FROM users WHERE rut_users = ?', req.session.passport.user)
      con.query("SELECT * FROM reposiciones", (err, reposiciones) => {
      	//console.log(motores)
        if (err) {
          res.json(err);
        }
        res.render('indexEL', {
          title: 'Encargado de Logística',
          data: reposiciones,
          tipo: row[0].tipo,
          mensaje4: req.flash('mensaje4')
        });

      });
    });


/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});

module.exports = router;
