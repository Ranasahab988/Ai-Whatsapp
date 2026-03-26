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
          "Authorization": "Bearer EAAU2mgyeFZCMBRI9V3XJG4I33PFFZCUg6lGLkro4R32j2AqYnVEAl3wwM5ugILoXGZAy7Vf5orq7I3VwK80gf4R5Rqfd7hNScw5qQLFlhZBsROsBjtUZCQ3JsLCGcZAhnKoqpGe0hoHkbzZCnl5uCtDYew1W4RVhGnfiGSYvM1ucu671UGIKyZBMGm462ZC6nLYZBY1PxnM4Rv5xGfAcxkZCZAo6BdJLBlGyw1feOeRq6MEPBJBFol8e3jh7FPcHJUDSPetamzwZCc3vWJ4UvtZA5KiU1D",
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
