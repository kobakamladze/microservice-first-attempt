const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/events", async (req, res) => {
  console.log(req.body);
  const { type, data } = req.body;

  try {
    // for (const comment of data) {
    if (type === "CommentCreated") {
      const status = data.content.includes("orange") ? "rejected" : "approved";

      await axios.post("http://event-bus-srv:4005/events", {
        type: "CommentModerated",
        data: { ...data, status },
      });
    }
    // }
  } catch (e) {
    console.log(e);
  }

  res.send({});
});

app.listen(4003, () => console.log("MODERATION. listening on PORT: 4003..."));
