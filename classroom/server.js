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

app.get("/greet", (req, res) => {
  let { name = "Hacker" } = req.cookies;
  console.log(name);
  res.send(`hello ${name}`);
});

app.get("/getcookie", (req, res) => {
  res.cookie("madeIn", "Pakistan");
  res.send("cookie sent");
});

app.get("/cookie2", (req, res) => {
  res.cookie("bade", "Assalam O Alykum");
  console.log(req.cookies);
  res.send("cookie 2 sent");
});

app.get("/signedcookie", (req, res) => {
  res.cookie("owner", "Qazi", { signed: true });
  res.send("signed successfully");
});

app.get("/allsignedcookies", (req, res) => {
  res.send("got it");
  console.log(req.signedCookies);
});

app.use("/users", user);
app.use("/posts", post);
