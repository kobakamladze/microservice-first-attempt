const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const posts = {};

const handleEvents = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, postId, content, status } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => comment.id === id);

    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  console.log(req.body);
  const { type, data } = req.body;

  handleEvents(type, data);

  res.send({});
});

app.listen(4002, async () => {
  console.log("QUERY. listening on PORT: 4002...");

  try {
    const response = await axios.get("http://event-bus-srv:4005/events");
    for (const event of response.data) {
      console.log("Processing event:", event.type);
      handleEvents(event.type, event.data);
    }
  } catch (e) {
    console.log(e);
  }
});
