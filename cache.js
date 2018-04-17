const redis = require('redis');
const client = redis.createClient({
    host: 'localhost',
    port: 6379
});

client.on('error', function(err) {
    console.log(err);
});

client.set('day', 'thursday', function(err, data) {
    console.log(err, data);
}))

//node cache.js

client.setex('month', 30, "april", function(err, data) {
    console.log(err, data);
})

client.del('day', function(err, data) {
    console.log(err, data);
}))

exports.get = function(key) {
    return new Promise(function (resolve, reject) {
        client.get(key, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
)}

exports.setex = function(key, expire, val) {
    return new Promise(function (resolve, reject) {
        client.setex(key, expire, val, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
)}


exports.del = function(key) {
    return new Promise(function (resolve, reject) {
        client.del(key, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
)}


cache.get('signers').then(function(signers) {
    if (signers) {
        res.render('signers', {
            signers: result.rows[0]
        })
    } else {
        return db.getSigners();
    }
}).then(function(result) {
    cache.setex('signers', 300, JSON.stringify(result.rows[0]))
    res.render('signers', {
        signers: result.rows[0]
    })
})

delete key when:
sign petition
delete sig
update Profile
