const express = require("express");
const crypto = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts/create", async (req, res) => {
  const id = crypto.randomUUID();
  const { title } = req.body;
  posts[id] = {
    id,
    title,
  };

  await axios.post("http://event-bus-srv:4005/events", {
    type: "PostCreated",
    data: {
      id,
      title,
    },
  });

  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  console.log("Recieved Events", req.body.type);
  res.send({});
});

app.listen(4000, () => {
  console.log("v2.0");
  console.log("POST. listening on PORT: 4000");
});
