import { Sequelize } from "sequelize";
import "dotenv/config.js"

const database=process.env.DATABASE
const username=process.env.DB_USERNAME
const password=process.env.DB_PASSWORD
const host=process.env.BB_HOST
const port=process.env.DB_PORT
const dialect=process.env.DB_DIALECT

const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect,
  logging: false,
});

export default sequelize