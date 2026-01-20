import { connection } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = "minha_chave_secreta";

export async function register(req, res) {
    try {
        const { username, senha } = req.body;

        if (!username || !senha) {
            return res.status(400).json({ error: "Dados inválidos" });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        await connection.query(
            "INSERT INTO usuarios (username, senha) VALUES (?, ?)",
            [username, senhaHash]
        );

        res.json({ message: "Usuário criado com sucesso" });
    } catch (error) {
        console.error("Erro no register:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
}

export async function login(req, res) {
    try {
        const { username, senha } = req.body;

        if (!username || !senha) {
            return res.status(400).json({ error: "Usuário ou senha ausentes" });
        }

        const [rows] = await connection.query(
            "SELECT * FROM usuarios WHERE username = ?",
            [username]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: "Usuário não encontrado" });
        }

        const usuario = rows[0];
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ error: "Senha inválida" });
        }

        const token = jwt.sign(
            { id: usuario.id },
            SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
}
