var spicedPg = require('spiced-pg');

var db = spicedPg('postgres:postgres:postgres@localhost:5432/cities');

getCities() {
    db.query('SELECT * FROM cities')
    .then(function(result) {
        console.log(result.rows);
    }).catch(function(err) {
        console.log(err);
    });
}

getCities(name, country) { //returns a promise
    return db.query('SELECT * FROM cities WHERE city = $1 AND country = $2', [name, country])
    .then(function(result) {
        return result.rows;
    }).catch(function(err) {
        console.log(err);
    });
}

getCities();

exports.getCities = getCities;

exports.signPetition(first, , ) {
     db.query('INSERT INTO signatures', [first, last, sig])
 }
