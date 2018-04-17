//route module
const db = require('./db')

app.get('/cities', function (req, res) {
    db.getCity().then(function(city) {
        res.render('city', {
            city
        })
    })
})
