const express = require("express");
const cors = require("cors");
const path = require("path");
// const mysql = require("mysql2");
const bodyParser = require("body-parser");
const { sequelize } = require("./models");

const testRouter = require("./router/test");
const createRouter = require("./router/create");
const fetchRouter = require("./router/fetch");
const updateRouter = require("./router/update");
const deleteRouter = require("./router/delete");
const reciptRouter = require("./router/receipt");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
sequelize
    .sync({ force: false })
    .then(() => {
        console.log("db connected");
    })
    .catch(err => {
        console.error(err);
    });

app.use(cors());
/*
app에 라우터 등록한다 
*/
app.use("/test", testRouter);
app.use("/create", createRouter);
app.use("/fetch", fetchRouter);
app.use("/update", updateRouter);
app.use("/delete", deleteRouter);
app.use("/receipt", reciptRouter);
app.listen(8080);
