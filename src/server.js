import express from "express";
import cors from "cors";
import routes from "./routes.js";

const app = express();
const PORT = 3000;

app.use(cors({
    origin: "*"
}));
app.use(express.json());
app.use(routes);

app.listen(PORT, () => console.log(`O servidor está rodando na porta ${PORT}`));