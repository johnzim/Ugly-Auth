var express             = require('express'),
    app                 = express(),
    chars               = require('./routes/chars'),
    swig                = require('swig'),
    cons                = require('consolidate'),
    passport            = require('passport'), LocalStrategy = require(
                                                                'passport-local').Strategy,
    _                   = require('underscore'),
    Sequelize           = require('sequelize'),
    passwordHash        = require('password-hash'),
    MySQLSessionStore   = require('connect-mysql-session')(express);

app.configure(function() {
    app.use(express.static('public'));
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({   secret: 'batman', 
                                store: new MySQLSessionStore(
                                    'authdb', 'admin', 'password', {}
                                    )
                            })
    );
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(app.router);
});


// Set the app to use Swig for its templating. Consolidate.js is a precon
app.engine('html', cons.swig);
app.set('view engine', 'html');

swig.init({
    root: './views/',
    allowErrors: true
});

// Our views are stored in ./views
app.set('views', './views/');

// Create a sequelize instance for the DB.
db = new Sequelize('authdb', 'admin', 'password', {
    host: "localhost",
    port: 8889
});

// We need the user and Session details here as we current handle Authentication in app.js
var User = db.import(__dirname + '/models/user.js');
var Session = db.import(__dirname + "/models/session.js");

// Passport is our Authentication engine and here's our strategy - a classic username &
// password system with a salted, hashed pw stored in the db user table row. 
passport.use(new LocalStrategy( function(username, password, done) {
    var foundUser = User.find({where: {username: username}}).success(function(user) {
        if (!user.validPassword(password)) {
            console.log("Incorrect password entered by user");
            return done(null, false, { message: 'Incorrect password.' });
        } else {
            console.log("Successful password validation");
            return done(null, user);
        }
    })
    })
);
        
// passport leaves session serialization to us to sort out.
// We're using connect-mysql-session with a small modification in place for the test DB
// needs to be changed for release/cloud test.
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    console.log("deserialize called");
    Session.find(id).success(function(session) {
        done(null, id);
    });
});




app.get('/', function(req, res) {
    res.render('login_page.html', {})
});

app.get('/signup', function(req, res){
  res.render('signup.html', {});
});

app.post('/new_user', function(req, res){
    User.create({username: req.body.username, password: passwordHash.
        generate(req.body.password)}).success(function(user){
            console.log(req.body.username);
            console.log(req.body.password);
            console.log(passwordHash.generate(req.body.password));
            res.render('signup_success.html', {});  
    })
});

app.post('/login', 
    passport.authenticate('local', {
        successRedirect: '/success',
        failureRedirect: '/fail',
        failureFlash: false })
); 

app.get('/fail', function(req, res){
    res.send('Login Failed');
});

app.get('/success', function(req, res){
    res.send('Password Correct!');
});

app.get('/chars', chars.chars);

app.get('/chars/:id', chars.char);


app.listen(3000);
console.log('awake and listening on port 3000');
