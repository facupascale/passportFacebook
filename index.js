let express = require('express')
let expressSession = require('express-session');
let passport = require('passport');
let yargs = require('yargs')
let { hideBin } = require('yargs/helpers')
let FacebookStrategy = require('passport-facebook').Strategy
let {randomsController} = require('./controllers/randomsController');
let { infoController } = require('./controllers/infoController');
let cluster = require('cluster');
let os = require('os');
let compression = require('compression');
let {logger} = require('./utils/winston/winston_config');
let fs = require('fs');


const app = express()

const credentials = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}

app.use(compression())
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set('views', './views')
// app.set('view engine', 'ejs') // => para login con facebook
app.set('view engine', 'hbs') 

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

app.get('/api/info', infoController.getInfo)

app.get('/api/randoms', randomsController.getRandoms)

let httpServer = require('http').Server(app);

const numCPUs = os.cpus().length

const argv = yargs(hideBin(process.argv))
.default({
  modo: 'FORK',
  puerto: process.env.PORT || 8080
})
.alias({
  m: 'modo',
  p: 'puerto'
    })
.argv

const PORT = process.env.PORT || argv.puerto

logger.info(`Valor de entorno NODE_ENV: ${process.env.NODE_ENV}`)

if (argv.modo.toUpperCase() == 'CLUSTER') {

    if (cluster.isPrimary) {
        console.log(`Master Cluster PID ${process.pid} is running.`)

        // FORK WORKER
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork()
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died.`)
            cluster.fork()
        })

    } else {

        const server = httpServer.listen(PORT, (err) => {
            if (err) {
                console.log("Error while starting server")
            } else {
                console.log(
                    `
                    ------------------------------------------------------------
                    WORKER ${server.address().port}  Process Pid: ${process.pid}
                    Open link to http://localhost:${server.address().port}     
                    -------------------------------------------------------------
                    `
                )
            }
        })

        server.on('error', error => console.log(`Error en servidorProcess Pid: ${process.pid}: ${error}`))
    }
    
} else {

    const server = httpServer.listen(PORT, 'localhost', (err) => {
        if (err) {
            console.log("Error while starting server")
        } else {
            console.log(
                `
                ------------------------------------------------------------
                Servidor http escuchando en el puerto ${server.address().port}
                Open link to http://localhost:${server.address().port}      
                -------------------------------------------------------------
                `
            )
        }
    })

    server.on('error', error => console.log(`Error en servidor ${error}`))

}
