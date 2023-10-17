import "dotenv/config";
import express from "express";
import sequelize from "./config/config.js";
import cors from "cors";
import rutas from "./rutas/rutas.js";
import { usuario, iniciarModelos } from "./modelos/index.js";
import userSeed from "./seed/userSeed.js";
import cookieParser from "cookie-parser";

const port = process.env.SERVER_PORT;
const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rutas);

try {
  await sequelize.authenticate();
  console.log("Coneccion establecida");
  await sequelize
    .sync({ force: true })
    .then(async () => {
      app.listen(port, () => {
        console.log(`server escuchando en puerto ${port}`);
      });
    })
    .then(() => {
      return Promise.all([
        usuario.count().then((count) => count === 0 && userSeed()),
      ]);
    });
} catch (error) {
  console.error(error);
}
