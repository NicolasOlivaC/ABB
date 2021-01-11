var express = require('express');
var router = express.Router();
var con = require('../mysqlcon');
var { isLoggedIn, isNotLoggedIn, isPM, isEL } = require('../public/lib/out')

//<<<<< CONSULTA QUE UTILIZAMOS EN LA VERSION ORIGINAL >>>>>>>
// router.get('/gestionProducto', isLoggedIn, isPM, async function(req,res, next) {
//   var row = await con.query('SELECT tipo FROM users WHERE rut_users = ?', req.session.passport.user)
//       con.query("SELECT * FROM motores", (err, motores, campos) => {
//         if (err) {
//           res.json(err);
//         }
//         res.render('PM/gestionProductos', {
//           title: 'Gestionar productos',
//           data: motores,
//           tipo: row[0].tipo,
//           mensaje: req.flash('mensaje')
//        });

//       });
// });


router.get('/gestionProducto', isLoggedIn, isPM, async (req, res) => {
  var row = await con.query('SELECT tipo FROM users WHERE rut_users = ?', req.session.passport.user)
  
  con.query('SELECT * FROM motores')
    .then((motores)=>{
      res.render('PM/gestionProductos', {
        title: 'Gestionar productos',
        data: motores,
        tipo: row[0].tipo,
        mensaje: req.flash('mensaje')
      });
    })
    .catch((err) => {
      res.redirect('/gestionProducto');
    })
})

//<<<<< CONSULTA QUE UTILIZAMOS EN LA VERSION ORIGINAL >>>>>>>
// router.get('/deleteProducto2/:id_motores',isLoggedIn, isPM, async (req, res) => {
//   const { id_motores } = req.params;
//   console.log(id_motores)
//   con.query('DELETE FROM motores WHERE id_motores = ?', id_motores, (err, resultado) => {
//     console.log(resultado)
//     if (resultado) {
//       if (resultado.affectedRows == 1) {
//         req.flash('mensaje', 'El producto se ha elimitado correctamente');
//         res.redirect('/gestionProducto');
//       }
//       else {
//         req.flash('mensaje', 'El producto no se ha podido eliminar');
//         res.redirect('/gestionProducto');
//       }
//     }
//     else {
//       req.flash('mensaje', 'El producto no se ha podido eliminar');
//       res.redirect('/gestionProducto');
//     }

//   })

// });

router.get('/deleteProducto2/:id_motores',isLoggedIn, isPM, async (req, res) => {
  const data = req.params;
  con.query('DELETE FROM motores WHERE id_motores = ?', data.id_motores)
    .then((resultadoDelete)=>{
      req.flash('mensaje', 'El motor se ha eliminado correctamente');
      res.redirect('/gestionProducto');
    })
    .catch((error)=>{
      req.flash('mensaje', 'El motor no se ha eliminar');
      res.redirect('/gestionProducto');
    })
});


//<<<<< CONSULTA QUE UTILIZAMOS EN LA VERSION ORIGINAL >>>>>>>
// router.post('/cons_ins_producto', isLoggedIn, isPM, async (req, res) => {
//   const data = req.body;
//   con.query('INSERT INTO motores set ?', [data], (err, resultado) => {
//     if (resultado) {
//       if (resultado.affectedRows == 1) {
//         req.flash('mensaje', 'El producto se ha agregado correctamente');
//         con.query('INSERT INTO inventario set motores_catalog_number = ?, stock = ?, stock_minimo = ?', [data.catalog_number, 0, 0], (err, habilidad) => {
//           console.log("insert en motores")
//           console.log(habilidad);
//         })
//         res.redirect('/gestionProducto');
//       }
//       else {
//         req.flash('mensaje', 'El producto no se ha podido agregar');
//         res.redirect('/gestionProducto');
//       }
//     }
//     else {
//       req.flash('mensaje', 'El producto no se ha podido agregar')
//       res.redirect('/gestionProducto');
//     }
//   })
// })


// <<<<< CONSULTA UTILIZANDO PROMESAS ASYNC >>>>>>>
router.post('/cons_ins_producto', isLoggedIn, isPM, async (req, res) => {
  const data = req.body;
  con.query('INSERT INTO motores set ?', [data])
    .then((resultadoPrimerInsert) => { 
      return con.query('INSERT INTO inventario set motores_catalog_number = ?, stock = ?, stock_minimo = ?', [data.catalog_number, 0, 0])
    })
    .then((resultadoSegundoInsert) => {
      req.flash('mensaje', `El motor "${data.catalog_number}" se ha agregado correctamente`);
      res.redirect('/gestionProducto');
    })
    .catch((err) => {
      req.flash('mensaje', `El motor "${data.catalog_number}" no se ha podido agregar`);
      res.redirect('/gestionProducto');
    })
})

//<<<<< CONSULTA UTILIZANDO PROMESA ASYNC AND AWAIT >>>>>>>
// router.post('/cons_ins_producto', isLoggedIn, isPM, async function (req, res) {
//   const data = req.body;
//   try {
//     await con.query('INSERT INTO motores set ?', [data]);
//     await con.query('INSERT INTO inventario set motores_catalog_number = ?, stock = ?, stock_minimo = ?', [data.catalog_number, 0, 0]);
//     req.flash('mensaje', 'El producto se ha agregado correctamente');
//     res.redirect('/gestionProducto');
//   }
//   catch (error) {
//     req.flash('mensaje', 'El producto no se ha podido agregar');
//     res.redirect('/gestionProducto');
//   }
// })

//<<<<< CONSULTA QUE UTILIZAMOS EN LA VERSION ORIGINAL >>>>>>>
// router.post('/updateProducto', isLoggedIn, isPM, async (req, res) => {
//   const data = req.body;
//   con.query('UPDATE motores set ? where catalog_number = ?', [data, data.catalog_number], (err, resultado) => {
//     console.log(resultado)

//     if (resultado) {
//       if (resultado.affectedRows == 1) {
//         req.flash('mensaje', 'El motor se ha modificado correctamente');
//         res.redirect('/gestionProducto');
//       }
//       else {
//         req.flash('mensaje', 'El motor no se ha podido modificar');
//         res.redirect('/gestionProducto');
//       }
//     }

//     else {
//       req.flash('mensaje', 'El motor no se ha podido modificar');
//       res.redirect('/gestionProducto');
//     }
//   })
// })

router.post('/updateProducto', isLoggedIn, isPM, async (req, res) => {
  const data = req.body;
  con.query('UPDATE motores set ? where catalog_number = ?', [data, data.catalog_number])
    .then((resultadoUpdate)=>{
      req.flash('mensaje', `El motor "${data.catalog_number}" se ha modificado correctamente`);
      res.redirect('/gestionProducto');
    })
    .catch((error)=>{
      req.flash('mensaje', `El motor "${data.catalog_number}" no se ha podido modificar`)
      res.redirect('/gestionProducto');
    })
})



module.exports = router;
