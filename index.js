const http = require("http");
const fs = require("fs");
var requests = require("requests");
var path = require("path");
// console.log(path);

const homeFile = fs.readFileSync("home.html", "utf-8");

// const tempCel = function fToC(fahrenheit) {
//   var fTemp = fahrenheit;
//   // console.log(fTemp);
//   var fToCel = ((fTemp - 32) * 5) / 9;
//   console.log(fToCel)
// };
// console.log(tempCel(270.98));

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempStatus%}", orgVal.weather[0].main);
  return temperature;
};

console.log("Starting App");

const express = require("express");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "/")));
app.get("/", (req, res) => {
  console.log("Checking endpoint");
  if (req.url == "/") {
    requests(
      "http://api.openweathermap.org/data/2.5/weather?q=Pune&appid=fa7bc5db2798113ae313540c3b6012d0"
    )
      .on("data", (chunk) => {
        console.log(chunk);
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        console.log(arrData[0].main.temp);
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realTimeData); //msg dekh
        console.log(path.join(__dirname + "/home.html"));
        // res.sendFile(path.join(__dirname + "/home.html"));

        // console.log(realTimeData);

        // res.write(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();

        // console.log("end");
      });
  }
});

// const server = http.createServer((req, res) => {
//   console.log("Checking endpoint");
//   if (req.url == "/") {
//     requests(
//       "http://api.openweathermap.org/data/2.5/weather?q=Pune&appid=fa7bc5db2798113ae313540c3b6012d0"
//     )
//       .on("data", (chunk) => {
//         console.log(chunk);
//         // const objdata = JSON.parse(chunk);
//         // const arrData = [objdata];
//         // console.log(arrData[0].main.temp);
//         // const realTimeData = arrData
//         //   .map((val) => replaceVal(homeFile, val))
//         //   .join("");
//         res.write(homeFile); //msg dekh

//         // console.log(realTimeData);

//         // res.write(realTimeData);
//       })
//       .on("end", (err) => {
//         if (err) return console.log("connection closed due to errors", err);
//         res.end();

//         // console.log("end");
//       });
//   }
// });
// // server.listen(3000, "127.0.0.1");
// server.listen(3000, "127.0.0.1");
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
