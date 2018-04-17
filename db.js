var spicedPg = require('spiced-pg');

var db;

if (process.env.DATABASE_URL){
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg('postgres:postgres:postgres@localhost:5432/petition');
}

// exports.signPetition = function(first, last, sig, user_id) {
//      return db.query('INSERT INTO signatures (first, last, signature, user_id) VALUES($1, $2, $3, $4) RETURNING id', [first, last, sig, user_id])
//  }

exports.signPetition = function(sig, user_id) {
     return db.query('INSERT INTO signatures (signature, user_id) VALUES($1, $2) RETURNING id', [sig, user_id])
 }

exports.getSignatureById = function(sigId) {
    return db.query('SELECT signature FROM signatures WHERE id = $1', [sigId])
}
// module.exports.signPetition === exports.signPetition === this.signPetition

exports.getSigners = function() {
    return db.query('SELECT users.first, users.last, age, url, city FROM signatures LEFT JOIN users ON users.id = signatures.user_id LEFT JOIN user_profiles ON users.id = user_profiles.user_id')
}

exports.getCount = () => db.query('SELECT COUNT (*) FROM signatures');

exports.register = (first, last, email, pass) => {
    return db.query('INSERT INTO users (first, last, email, pass) VALUES($1, $2, $3, $4) RETURNING id', [first, last, email, pass])
}

exports.getMatchesByEmail = (email) => {
    return db.query('SELECT users.first, users.last, pass, users.id, signatures.id AS sigid FROM users LEFT JOIN signatures ON users.id = signatures.user_id WHERE email = $1', [email])
}

exports.addInfo = (age, city, url, user_id) => {
    return db.query('INSERT INTO user_profiles (age, city, url, user_id) VALUES ($1, $2, $3, $4) RETURNING id', [+age, city, url, user_id])
}

exports.getInfo = (id) => {
    return db.query('SELECT first, last, email, pass, age, city, bulletin, url FROM users LEFT JOIN user_profiles ON users.id = user_profiles.user_id WHERE users.id = $1', [id])
}

exports.updateUser = (first, last, email, id) => {
    return db.query('UPDATE users SET first = $1, last = $2, email = $3 WHERE id = $4', [first, last, email, +id])
}

exports.updateUserPass = (first, last, email, pass, id) => {
    return db.query('UPDATE users SET first = $1, last = $2, email = $3, pass = $4 WHERE id = $5', [first, last, email, pass, id])
}

exports.updateProfile = (age, city, url, bulletin, user_id) => {
    return db.query('INSERT INTO user_profiles (age, city, url, bulletin, user_id) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (user_id) DO UPDATE SET age = $1, city = $2, url = $3, bulletin = $4', [+age, city, url, bulletin, user_id])
}

exports.deleteSig = (user_id) => {
    return db.query('DELETE FROM signatures WHERE user_id = $1', [user_id])
}

exports.getSignersByCity = (city) => {
    return db.query('SELECT first, last, age, url FROM users LEFT JOIN user_profiles ON users.id = user_profiles.user_id WHERE LOWER(city) = LOWER($1)', [city])
}

// parse url if https =>
