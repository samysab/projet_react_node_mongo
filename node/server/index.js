const express = require("express");
const port = process.env.PORT || 3000;
const app = express();
const HttpCodesRouter = require("./routes/HttpCode");
const UserRouter = require("./routes/User");
const PostRouter = require("./routes/Post");
const MessageRouter = require("./routes/Message");
const SecurityRouter = require("./routes/Security");
const checkAuthentication = require("./middlewares/checkAuthentication");
const cors = require('cors')

app.use(express.json());
const corsOption = {
  origin: ['http://localhost:3000'],
};
app.use(cors(corsOption));

app.get("/", (req, res, next) => {
  res.send("Hello world!");
});

//app.use(HttpCodesRouter);
app.use(SecurityRouter);
app.use("/messages", checkAuthentication, MessageRouter);
app.use("/http-codes", HttpCodesRouter);
app.use("/users", checkAuthentication, UserRouter);
app.use("/posts", checkAuthentication, PostRouter);

app.listen(port, () => console.log(`Server started ${port}`));
