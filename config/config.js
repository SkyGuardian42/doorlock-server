module.exports = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: "database_production",
  host: "0.0.0.0",
  dialect: "sqlite",
  "operatorsAliases": false,
  "storage": ".data/database.sqlite",
  "pool": {
    "max": 5,
    "min": 0,
    "acquire": 30000,
    "idle": 10000
  }  
}
