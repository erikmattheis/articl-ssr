import express from "express";
import compression from "compression";
import serveStatic from "serve-static";
import history from "connect-history-api-fallback";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(history());
app.use(compression());
app.use(serveStatic(path.join(__dirname, "dist")));

const port = process.env.FRONTEND_PORT;

app.listen(port);
