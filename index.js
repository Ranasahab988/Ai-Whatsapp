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

      const response = await fetch(`https://graph.facebook.com/v18.0/1017087464821642/messages`, {
  method: "POST",
  headers: {
    "Authorization": "Bearer EAAU2mgyeFZCMBRPSeQTemj5xb7ZAXS00dZB48PVMZBMe5WefhRRIaNn2mSacNwmTBA3ZBK5h9tMxum5hadsjIc8fcqffMqVd69iw5CRlmKRX4JPsR6cRWKq3ruvNZCUXtaJrujXFhuD33W6FtEtRDymLueDsXSacc3FJHQT15zUzy1QH7MK20Cw2KC8ZA3ZARJpZA2mLg3lEdLAFRW66rnBxFa39tHRnJN4eyX93ydjMpj0dlwXBQXJMfsHt1e3sxZBo2ZComCem7GB5nufTdiyM4rT",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    messaging_product: "whatsapp",
    to: from,
    text: { body: "Reply test ho raha hai ✅" }
  })
});

const data = await response.json();
console.log("📤 WhatsApp API Response:", data);

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
