import express from "express";

const app = express();
app.use(express.json());

// ✅ Test route (check server working)
app.get("/", (req, res) => {
  res.send("✅ AI WhatsApp Tool Server Running");
});

// ✅ Webhook for WhatsApp (future use)
app.post("/webhook", (req, res) => {
  console.log("📩 Incoming Webhook:", JSON.stringify(req.body, null, 2));

  // Facebook/WhatsApp verification response
  res.status(200).send("EVENT_RECEIVED");
});

// ✅ Verification route (important for WhatsApp API)
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "my_verify_token";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ✅ Server start
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
