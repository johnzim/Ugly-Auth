var express = require('express');
var app = express();
var chars = require('./routes/chars');
var swig = require('swig');
var cons = require('consolidate');
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
var user = require('./user.js');
var _ = require('underscore');

app.configure(function() {
  app.use(express.static('public'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'batmantv' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

app.engine('html', cons.swig);
app.set('view engine', 'html');





swig.init({
    root: './views/',
    allowErrors: true
});

app.set('views', './views/');


passport.use(new LocalStrategy( function(username, password, done) {
     var response = user.findOne({username: username});
     if (!response) {
            console.log("incorrect user");
            return done(null, false, { message: 'Incorrect username.' });
        }
     if (!user.validPassword(password)) {
         console.log("incorrect pass");
        return done(null, false, { message: 'Incorrect password.' });
     }
     return done(null, response);
    }
));
		
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log("deserialize called");
//  User.findById(id, function(err, user) {
    done(null, id);
  //});
});

app.get('/', function(req, res) {
	res.render('login_page.html', {})
	}
);


app.post('/login', 
	passport.authenticate('local', {successRedirect: '/success',
									failureRedirect: '/fail',
									failureFlash: false })
); 


app.get('/ello.txt', function(req, res) {
    var body = 'What the hell';
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', body.length);
    res.end(body);
});


app.get('/pie.txt', function(req, res){
  res.send('pie time');
});

app.get('/fail', function(req, res){
  res.send('Password Incorrect');
});

app.get('/success', function(req, res){
  res.send('Password Correct!');
});

app.get('/chars', chars.chars);

app.get('/chars/:id', chars.char);


app.listen(3000);
console.log('awake and listening on port 3000');
