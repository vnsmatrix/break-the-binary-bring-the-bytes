const express = require('express')
const app = express()
const https = require('https')
var hb = require('express-handlebars')
app.engine('handlebars', hb())
app.set('view engine', 'handlebars')
const {signPetition, getSignatureById, getSigners, getCount, register, getMatchesByEmail, addInfo, getSignersByCity, getInfo, updateUser, updateUserPass, updateProfile, deleteSig} = require('./db')
const {hashPassword, checkPassword} = require('./bcrypt')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const csurf = require('csurf');
// const cache = require('./cache')

//redis:
// cache.setex('leo', 25, JSON.stringify(leo)).then(function() {
//     return cache.get('leo');
// }).then(function(val) {
//     console.log(JSON.parse(val));
// });

//MIDDLEWARE:
app.use(cookieSession({
    secret: 'nobody knows this secret but me',
    maxAge: 1000 * 60 * 60 * 24 * 7 * 6
}));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(csurf());

app.use(function(req, res, next) {
    res.setHeader('X-Frame-Options', 'DENY');
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(express.static('./public'))

app.use(function(req, res, next) {
    if(req.session.userId == undefined && req.url != '/register' && req.url !='/login') {
        res.redirect('/register')
    } else if (req.session.userId != undefined && req.url == '/register' ) {
        res.redirect('/petition')
    } else if (req.session.userId != undefined && req.url == '/login' && req.session.sigId != undefined) {
        res.redirect('/thankyou')
    } else if (req.session.userId != undefined && req.url == '/login' && req.session.sigId == undefined) {
        res.redirect('/petition')
    } else {
        next();
    }
})

var logged;

//ROUTES:
app.get('/', (req, res) => res.redirect('/register'))

app.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register',
        logged: logged,
        layout: 'main'
    })
})

app.post("/register", (req, res) => {
    if (req.body.email && req.body.pass && req.body.first && req.body.last) {
        hashPassword(req.body.pass).then (result => {
            // console.log(result);
            register(req.body.first, req.body.last, req.body.email, result).then(result => {
                req.session.userId = {
                    id: result.rows[0].id,
                    first: req.body.first,
                    last: req.body.last,
                    email: result.rows[0].email,
                    pass: result.rows[0].pass
                }
                res.redirect("/profile");
            }).catch(e => {
                console.log(e);
                const error = {
                    message: 'EMAIL ALREADY REGISTERED: PLEASE LOG IN'
                }
                res.render('register', {
                    title: 'Register',
                    logged: logged,
                    error: error,
                    layout: 'main'
                })
            })
        }).catch(e => {
            console.log(e);
        })
    } else {
        const error = {
            message: 'PLEASE TRY AGAIN FILLING ALL THE BLANKS'
        }
        res.render('register', {
            title: 'Register',
            logged: logged,
            error: error,
            layout: 'main'
        })
    }
})

app.get('/profile', (req, res) => {
    res.render('profile', {
        title: 'Profile',
        logged: req.session.userId,
        layout: 'main'
    })
})

app.post("/profile", (req, res) => {
    addInfo(req.body.age, req.body.city, req.body.url, req.session.userId.id).then(result => {
        res.redirect('/petition')
    }).catch(e => {
        console.log(e);
    })
})

app.get('/edit', (req, res) => {
    getInfo(req.session.userId.id).then(result => {
        var info = {
            first: result.rows[0].first,
            last: result.rows[0].last,
            email: result.rows[0].email,
            age: result.rows[0].age,
            city: result.rows[0].city,
            bulletin: +result.rows[0].bulletin,
            url: result.rows[0].url
        }
        console.log(info);
        res.render('edit', {
            title: 'Profile',
            layout: 'main',
            logged: req.session.userId,
            info: info
        })
    }).catch(e => {
        console.log(e);
    })
})

app.post('/edit', (req, res) => {
    if(!req.body.pass) {
        updateUser(req.body.first, req.body.last, req.body.email, req.session.userId.id).then(result => {
            updateProfile(req.body.age, req.body.city, req.body.url, req.body.bulletin, req.session.userId.id).then(result => {
                res.redirect('/thankyou')
            }).catch(e => {
                console.log(e);
            })
        }).catch(e => {
            console.log(e);
        })
    } else { //todo: if no signature, ERROR when updating
        hashPassword(req.body.pass).then(result => {
            updateUserPass(req.body.first, req.body.last, req.body.email, result, req.session.userId.id).then(result => {
                updateProfile(req.body.age, req.body.city, req.body.url, req.body.bulletin, req.session.userId.id).then(result => {
                    res.redirect('/thankyou')
                }).catch(e => {
                    console.log(e);
                })
            }).catch(e => {
                console.log(e);
            })
        }).catch(e => {
                console.log(e);
        })
    }
})

app.get('/login', (req, res) => {
    res.render('login', {
        title: 'Welcome back! ⚥',
        logged: false,
        layout: 'main'
    })
})

app.post("/login", (req, res) => {
    if (req.body.email && req.body.pass) {
        getMatchesByEmail(req.body.email).then(result => {
            if (result.rows[0] == undefined) {
                const error = {
                    message: 'UNKOWN EMAIL, PLEASE TRY AGAIN'
                }
                res.render('login', {
                    title: 'Log In',
                    error: error,
                    logged: false,
                    layout: 'main'
                })
            } else {
            // console.log(req.body.pass, result.rows[0].pass);
                checkPassword(req.body.pass, result.rows[0].pass).then(result2 => {
                    // console.log(result);
                    if (result2 == false) {
                        const error = {
                            message: 'WRONG PASS, PLEASE TRY AGAIN'
                        }
                        res.render('login', {
                            title: 'Log In',
                            error: error,
                            logged: false,
                            layout: 'main'
                        })

                    } else {
                        req.session.userId = {
                            id: result.rows[0].id,
                            first: result.rows[0].first,
                            last: result.rows[0].last,
                            email: result.rows[0].email,
                            pass: result.rows[0].pass
                        }
                        req.session.sigId = result.rows[0].sigid;
                        res.redirect('/thankyou')
                    }
                }).catch(e => {
                    console.log(e);
                })
            }
        }).catch(e => {
            console.log(e);
        })
    } else {
        const error = {
            message: 'PLEASE TRY AGAIN FILLING ALL THE BLANKS'
        }
        res.render('login', {
            title: 'Log In',
            error: error,
            logged: false,
            layout: 'main'
        })
    }
})

app.get('/petition', (req, res) => {
    // console.log(req.session);
    if (req.session.sigId) {
        res.redirect('/thankyou')
    } else {
        res.render('petition', {
            title: 'Petition',
            logged: req.session.userId,
            layout: 'main'
        })
    }
})

app.post("/petition", (req, res) => {
    if (req.body.sig) {
        signPetition(req.body.sig, req.session.userId.id)
        .then(result => {
            // console.log(result.rows[0]);
            req.session.sigId = result.rows[0].id
            // req.session.userId = {
            //     id: result.rows[0].user_id,
            //     email: result.rows[0].email,
            //     pass: result.rows[0].pass
            // }
            res.redirect("/thankyou");
        }).catch(e => {
            console.log(e);
        })
    } else {
        const error = {
            message: 'PLEASE TRY AGAIN FILLING ALL THE BLANKS'
        }
        res.render('petition', {
            title: 'Petition',
            error: error,
            logged: req.session.userId,
            layout: 'main'
        })
    }
})

app.get('/thankyou', (req, res) => {
    if (req.session.sigId == undefined) {
        return res.redirect('/petition')
    }
    console.log("req.session.sigId", req.session.sigId);
    getCount().then(function(count) {
        console.log(count);
        getSignatureById(req.session.sigId).then(function(result) {
            console.log(result);
            console.log(count.rows[0].count);
            res.render('thankyou', {
                title: 'Thank you!',
                src: result.rows[0].signature,
                layout: 'main',
                logged: req.session.userId,
                number: count.rows[0].count
            })
        }).catch(e => {
                console.log(e);
        })
    }).catch(e => {
            console.log(e);
    })
})

app.post('/delete', (req, res) => {
    console.log(req.session.userId);
    deleteSig(req.session.userId.id).then(result => {
        req.session.sigId = undefined;
        res.redirect("/thankyou");
    }).catch(e => {
        console.log(e);
    })
})

app.get('/signers', (req, res) => {
    if (req.session.sigId == undefined) {
        return res.redirect('petition')
    }
    getSigners().then(function(result) {
        // console.log(result.rows);
        function loopSigners(obj) {
            var names = [];
            for (var i = 0; i < obj.length; i++) {
                let o = {
                    first: result.rows[i].first,
                    last: result.rows[i].last,
                    age: result.rows[i].age,
                    city: result.rows[i].city,
                    url: result.rows[i].url
                }
                names.push(o)
                // names.push(result.rows[i].first + ' ' + result.rows[i].last + '(' + result.rows[i].age + ', ' + result.rows[i].city + ')')
            }
            return names;
        }
        res.render('signers', {
            title: 'Signers',
            name: loopSigners(result.rows),
            logged: req.session.userId,
            layout: 'main'
        })
    }).catch(e => {
        console.log(e);
    })
})

app.get('/signers/:city', (req, res) => {
    getSignersByCity(req.params.city).then(result => {
        console.log(result);
        function loopSigners(obj) {
            var names = [];
            for (var i = 0; i < obj.length; i++) {
                let o = {
                    first: result.rows[i].first,
                    last: result.rows[i].last,
                    age: result.rows[i].age,
                    url: result.rows[i].url
                }
                names.push(o)
                // names.push(result.rows[i].first + ' ' + result.rows[i].last + '(' + result.rows[i].age + ', ' + result.rows[i].city + ')')
            }
            return names;
        }
        res.render('city', {
            title: 'Signers By City',
            name: loopSigners(result.rows),
            logged: req.session.userId,
            layout: 'main'
        })
    }).catch(e => {
        console.log(e);
    })

})

app.post('/delete', (req, res) => { //todo
    db.deleteSig(req.session.userId.id).then(function () {
        console.log(req.session);
        req.session.sigId = null;
        res.redirect('/petition')
    }).catch(e => {
            console.log(e);
    })
})

app.get('/home', (req, res) => {
    res.render('home', {
        title: 'home',
        logged: req.session.userId,
        layout: 'main'
    })
})

//DELETE SESSION (cookies):
app.get('/logout', (req, res) => {
    req.session = null
    //req.session.destroy(function() { //redis
    res.redirect('/')
    // })
})

app.listen(process.env.PORT || 8080, () => console.log('Listening'))
