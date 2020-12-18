var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var favicon = require('serve-favicon');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var inventarioRouter = require('./routes/inventario');
var estadisticasRouter = require('./routes/estadisticas');
var userRouter = require('./routes/user');
var userProductos = require('./routes/productos');
var usuariosRouter= require('./routes/usuarios');
var encargadoLogisticaRouter = require('./routes/logistica');
var resetclaveRouter = require('./routes/forgot');
var reposicionRouter = require('./routes/reposicion');
var q1Router = require('./routes/api/q1');
var q2Router = require('./routes/api/q2');
var q3Router = require('./routes/api/q3');
var clientesRouter = require('./routes/clientes');

var app = express();
require('./public/lib/passport');
var port = 3000;
var tipo = '';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(session({
  secret: 'ABB',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')));


app.use(flash());
app.use((req, res, next) => {
  app.locals.success = req.flash('success')
  app.locals.message = req.flash('message')
  app.locals.user = req.user
  next()
})

app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', inventarioRouter);
app.use('/', estadisticasRouter);
app.use('/', userRouter);
app.use('/', userProductos);
app.use('/', usuariosRouter);
app.use('/', encargadoLogisticaRouter);
app.use('/', resetclaveRouter);
app.use('/', reposicionRouter);
app.use('/', q1Router);
app.use('/', q2Router);
app.use('/', q3Router);
app.use('/', clientesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//app.listen(port, () => {
//  console.log(`Example app listening at http://localhost:${port}`)
//})

module.exports = app;
