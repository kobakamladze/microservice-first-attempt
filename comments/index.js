const express = require("express");
const crypto = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const postId = req.params.id;
  const commentId = crypto.randomUUID();
  const { content } = req.body;

  const comments = commentsByPostId[postId] || [];
  comments.push({ id: commentId, postId, content, status: "pending" });
  commentsByPostId[postId] = comments;
  console.log(commentsByPostId[postId]);

  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId,
      status: "pending",
    },
  });

  res.status(201).send(commentsByPostId[postId]);
});

app.post("/events", async (req, res) => {
  console.log("Recieved Events", req.body.type);

  const { type, data } = req.body;

  if (type === "CommentModerated") {
    const { id, postId, content, status } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;

    await axios.post("http://localhost:4005/events", {
      type: "CommentUpdated",
      data: { id, postId, content, status, content },
    });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log("COMMENTS. listening on PORT: 4001");
});
