import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { Register } from "./controllers/auth.js";
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import { createPost } from "./controllers/posts.js";
import postRoutes from "./routes/posts.js"
import { verifyToken } from "./middleware/auth.js";

/* ONLY FOR DEV TEST */
import User from "./models/User.js";
import { users, posts } from "./data/index.js";
import Post from "./models/Post.js";
/********************/

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (res, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (res, file, cb) {
        cb(null, file.originalname);
    }
})
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), Register)
app.post("/posts", verifyToken, upload.single("picture"), createPost)

/* ROUTES */
app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/posts", postRoutes)

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, async () => {
        console.log(`\x1B[34mServer listening on port: \x1B[35m${PORT}\x1B[30m`);

        /* 
            BELOW PIECES OF CODE ARE JUST FOR GENERATING 
            DUMMY DATA FOR DEV TEST & MUST BE DELETED FOR 
            PRODUCTION MODE.
        */
        const testUser = await User.findOne({ email: "test@test.com" });
        if (!testUser) {
            await User.insertMany(users)
            await Post.insertMany(posts)
        }
        /***********************************************/
    })
}).catch((error) => {
    console.log(`\x1B[31m${error}, did not connect\x1B[30m`)
})
