import express from "express";
import fetch from "node-fetch";
const app = express();
app.use(express.json());

// ✅ Test route (check server working)
app.get("/", (req, res) => {
  res.send("✅ AI WhatsApp Tool Server Running");
});

// ✅ Webhook for WhatsApp (future use)
app.post("/webhook", async (req, res) => {
  console.log("📩 Incoming Webhook:", JSON.stringify(req.body, null, 2));

  try {
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (message) {
      const from = message.from;
      const msgText = message.text?.body;

      console.log("User:", from);
      console.log("Message:", msgText);

      await fetch(`https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages`, {
        method: "POST",
        headers: {
          "Authorization": "Bearer YOUR_ACCESS_TOKEN",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: from,
          text: { body: "Bhai message mil gaya ✅" }
        })
      });
    }

  } catch (error) {
    console.error("Error:", error);
  }

  res.sendStatus(200);
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
