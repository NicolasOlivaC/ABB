var express = require('express');
var router = express.Router();
var con = require('../../mysqlcon');

router.get('/api/test', function(req,res, next) {  //kk _ Toda la informacion de un heroe en especifico.
    con.query("SELECT * FROM inventario", (err, inventario) => {
    	console.log(inventario)
      if (err) {
        res.json(err);
      }
      res.json(inventario);
      // res.render('test', {
      //   data: motores
      // });
    });
  });

module.exports = router;