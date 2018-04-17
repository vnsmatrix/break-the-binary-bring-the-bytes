var spicedPg = require("spiced-pg");

var dbUrl = "postgres://postgres:postgres@localhost:5432/petition";

dbUrl = require("url").parse(dbUrl);

var dbUser = dbUrl.auth.split(":");

var dbConfig = {
    user: dbUser[0],
    database: dbUrl.pathname.slice(1),
    password: dbUser[1],
    host: dbUrl.hostname,
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000
};

var pool = new pg.Pool(dbConfig);

pool.on("error", function(err) {
    console.log(err);
});
