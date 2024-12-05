// send http request by reading json file to server

const fs = require("fs");
const axios = require("axios");

// const inputFilePath = "./fail.json";
const inputFilePath = "./empty.json";
// const baseUrl = "http://localhost:8000";
const baseUrl = "https://smart-factory.cloud.foxtronev.com";

async function loginToGetToken(baseUrl, account, pwd) {
  const res = await axios.post(baseUrl + "/user/login", {
    name: account,
    password: pwd,
  });
  return res.data.message;
}

async function sendRequest(baseUrl, inputFilePath) {
  const token = await loginToGetToken(baseUrl, "yulon_sanyi", "sanyi@39012");
  console.log(token);
  fs.readFile(inputFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    // const jsonData = JSON.parse(data);
    axios.defaults.headers.common["Authorization"] = `${token}`;
    axios
      .post(baseUrl + "/production-station-diagnostics", data)
      .then((response) => {
        console.log(response.data);
        console.log("Data sent successfully.");
      })
      .catch((error) => {
        console.error(error);
      });
  });
}

sendRequest(baseUrl, inputFilePath);
