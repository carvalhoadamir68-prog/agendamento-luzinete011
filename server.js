import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
const __dirname = path.resolve();
const upload = multer({ dest: path.join(__dirname, "uploads/") });

app.use(express.static(path.join(__dirname, "public")));

app.post("/submit", upload.fields([{ name: "fileUpload" }, { name: "imageUpload" }]), (req, res) => {
  try {
    const body = req.body || {};
    const files = req.files || {};
    const log = {
      time: new Date().toISOString(),
      body,
      files: Object.keys(files).reduce((acc, k) => {
        acc[k] = files[k].map(f => ({ originalname: f.originalname, path: f.path }));
        return acc;
      }, {})
    };
    const logsDir = path.join(__dirname, "logs");
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
    fs.appendFileSync(path.join(logsDir, "submits.log"), JSON.stringify(log) + "\n");
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Erro no /submit:", err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));