const express = require("express");
const app = express();
const port = 3000;
const user = require("./routes/user");
const post = require("./routes/post");
const cookieParser = require("cookie-parser");

app.use(cookieParser("ILovePakistan"));

app.listen(port, () => {
  console.log("listening to port", port);
});

app.get("/sendsigned", (req, res) => {
  res.cookie("owner", "qazi", { signed: true });
  res.send("signed cookies sent");
});

app.get("/getsigned", (req, res) => {
  console.log(req.signedCookies);
  res.send("got signed cokkies");
});

app.use("/users", user);
app.use("/posts", post);
