import  express  from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { PORT, URI } from "./config/index.js";
import App from "./routes/index.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const server = express();
server.use(cors());
server.disable("x-powered-by");
server.use(cookieParser());
server.use(express.urlencoded({extended: false}));
server.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicPath = path.join(__dirname, '..', 'public');
// Serve the static files from the public directory
server.use(express.static(publicPath));

mongoose.promise = global.Promise;
mongoose.set("strictQuery", false);
mongoose
    .connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology:true 
    })
    .then(console.log("Connected to database"))
    .catch((err) => console.log(err));

server.use(App);

server.listen(PORT, () =>
    console.log(`Server runnning on http://localhost:${PORT}`)
    );

