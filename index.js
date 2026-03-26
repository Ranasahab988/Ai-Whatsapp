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

      await fetch(`https://graph.facebook.com/v18.0/1017087464821642/messages`, {
        method: "POST",
        headers: {
          "Authorization": "Bearer EAAU2mgyeFZCMBRFrvsPhZCWeZAZCnZCsHbY7pMlgOnJn59WTUZBhH5V1n9LXrk7ZAWW37Bx2CZAEycGnMm1LdJ78V3ZBjqOLFMzYbd287OsP6xEiKejxPEgZAvErSGeVH1OZCLOmrlLYZCFqVgZCHJ1O7UNyS8ZAcVzKeg8hAI41iMgmXT5Eu4tISdvWMaavldUdrKowuZCEQxtQTVD5JlHZB6hDjZAbW5lpqM2sAboL9WZCFb93WRoUcrf776d6fQ2TVakDUuKXpwyZBu0HaIW2Fu06FVDsnRZC",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: from,
          type: "template",
template: {
  name: "welcome_msg",
  language: { code: "en_US" },
  components: [
    {
      type: "body",
      parameters: [
        {
          type: "text",
          text: "Chaman sir / mam"
        }
      ]
    }
  ]
}
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
