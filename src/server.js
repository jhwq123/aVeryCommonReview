import flash from "express-flash";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import postRouter from "./routers/postRouter";
import apiRouter from "./routers/apiRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() +"/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: process.env.COKKIE_SECRET, resave: false, saveUninitialized: flase, store: MongoStore.create({mongoUrl: process.env.DB_URL}),
}));
app.get("/add-one", (req, res, next) => {
    req.session.counter += 1;
    return res.saveUninitialized(`${req.session.id}\n${req.session.counter}`);
});
app.use(flash());
app.use(localsMiddleware);
app.use("/", rootRouter);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use((req, res, next) => {
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    next();
});
app.use("/posts", postRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

export default app;
