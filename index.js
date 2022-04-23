let express = require('express')
let expressSession = require('express-session');
const app = express()
const PORT = 3000;
let passport = require('passport');
let FacebookStrategy = require('passport-facebook').Strategy

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set('views', './views')
app.set('view engine', 'ejs')

passport.use( new FacebookStrategy({
  clientID: 1109957979550535,
  clientSecret: 'fbbba54e037299cf10268200917f1351' ,
  callbackURL: '/auth/facebook/callback',
}, 
  function(accesToken, refreshToken, profile, done) {
    console.log(profile)  
    done(null, user);
  }
));

app.use(expressSession({
  secret: 'hola',
  cookie: {
    httpOnly: false,
    secure: false,
    maxAge: 10000,
  },
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/datos',
  failureRedirect: '/registro'
}))

let isAuth = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
}

let isNotAuth = (req, res, next) => {
  if(!req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/datos')
  }
}

app.get('/datos', isAuth, (req, res, next) => {
  if(!req.user.contador) {
    req.user.contador = 1
  } else {
    req.user.contador++;
  }
  res.render('datos', {
    contador: req.user.contador,
    usuario: req.user
  })
})


app.get('/registro', isNotAuth, (req, res, next) => {
  res.render('registro');
})

app.get('/registro', passport.authenticate('register', { failureRedirect: 'registro-error', successRedirect: 'datos'}))

app.get('/', (req, res, next) => {
  res.redirect('login')
})

app.get('/login', (req, res, next) => {
  res.render('login')
})

app.post('/login', passport.authenticate('login', { failureRedirect: 'registro', successRedirect: 'datos'}))

app.get('/logout', (req, res, next) => {
  req.session.destroy( err => {
    if(err) res.sen(JSON.stringify(err));
    res.redirect('login')
  })
})



app.listen(PORT, (err) => {
  if (err) return console.log('error en listen server', err);
  console.log(`Server running on PORT ${PORT}`)
})
