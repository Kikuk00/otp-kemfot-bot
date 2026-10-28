const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const TOKEN = "9197169887:AAGMRi-J_XSIG48yCL4Zm5tyPuCYZdVVKCQ";
const CHAT_ID = "@otpkemfot";

function getFlag(data) {
  const str = JSON.stringify(data).toLowerCase();
  const flags = [
    // Asia & Asia Tenggara
    { flag: "🇮🇩", keys: ["indonesia", "+62", " id "] },
    { flag: "🇲🇾", keys: ["malaysia", "+60", " my "] },
    { flag: "🇹🇭", keys: ["thailand", "+66", " th "] },
    { flag: "🇵🇭", keys: ["philippines", "filipina", "+63", " ph "] },
    { flag: "🇻🇳", keys: ["vietnam", "+84", " vn "] },
    { flag: "🇸🇬", keys: ["singapore", "singapura", "+65", " sg "] },
    { flag: "🇲🇲", keys: ["myanmar", "+95", " mm "] },
    { flag: "🇰🇭", keys: ["cambodia", "kamboja", "+855", " kh "] },
    { flag: "🇱🇰", keys: ["sri lanka", "srilangka", "+94", " lk "] },
    { flag: "🇮🇳", keys: ["india", "+91", " in "] },
    { flag: "🇵🇰", keys: ["pakistan", "+92", " pk "] },
    { flag: "🇦🇫", keys: ["afghanistan", "+93", " af "] },
    { flag: "🇹🇯", keys: ["tajikistan", "+992", " tj "] },
    { flag: "🇦🇿", keys: ["azerbaijan", "+994", " az "] },
    { flag: "🇺🇿", keys: ["uzbekistan", "+998", " uz "] },
    { flag: "🇰🇿", keys: ["kazakhstan", "+76", "+77", " kz "] },

    // Afrika
    { flag: "🇧🇯", keys: ["benin", "+229", " bj "] },
    { flag: "🇲🇱", keys: ["mali", "+223", " ml "] },
    { flag: "🇹🇬", keys: ["togo", "+228", " tg "] },
    { flag: "🇿🇼", keys: ["zimbabwe", "+263", " zw "] },
    { flag: "🇸🇩", keys: ["sudan", "+249", " sd "] },
    { flag: "🇳🇬", keys: ["nigeria", "+234", " ng "] },
    { flag: "🇰🇪", keys: ["kenya", "+254", " ke "] },
    { flag: "🇿🇦", keys: ["south africa", "afrika selatan", "+27", " za "] },
    { flag: "🇪🇬", keys: ["egypt", "mesir", "+20", " eg "] },

    // Amerika
    { flag: "🇺🇸", keys: ["united states", "usa", "+1", " us "] },
    { flag: "🇨🇦", keys: ["canada", "kanada", "+1", " ca "] },
    { flag: "🇧🇷", keys: ["brazil", "brasil", "+55", " br "] },
    { flag: "🇵🇪", keys: ["peru", "+51", " pe "] },
    { flag: "🇵🇾", keys: ["paraguay", "+595", " py "] },
    { flag: "🇲🇽", keys: ["mexico", "meksiko", "+52", " mx "] },
    { flag: "🇦🇷", keys: ["argentina", "+54", " ar "] },
    { flag: "🇨🇱", keys: ["chile", "+56", " cl "] },
    { flag: "🇨🇴", keys: ["colombia", "kolombia", "+57", " co "] },

    // Eropa
    { flag: "🇷🇺", keys: ["russia", "rusia", "+7", " ru "] },
    { flag: "🇩🇪", keys: ["germany", "jerman", "+49", " de "] },
    { flag: "🇬🇧", keys: ["united kingdom", "uk", "inggris", "+44", " gb "] },
    { flag: "🇫🇷", keys: ["france", "prancis", "+33", " fr "] },
    { flag: "🇳🇱", keys: ["netherlands", "belanda", "+31", " nl "] },
    { flag: "🇮🇹", keys: ["italy", "italia", "+39", " it "] },
    { flag: "🇪🇸", keys: ["spain", "spanyol", "+34", " es "] },
    { flag: "🇺🇦", keys: ["ukraine", "ukraina", "+380", " ua "] },
    { flag: "🇵🇱", keys: ["poland", "polandia", "+48", " pl "] }
  ];

  for (const item of flags) {
    if (item.keys.some(key => str.includes(key))) return item.flag;
  }
  return "🌐";
}

// 1. Endpoint buat Test / Ping dari Browser & AuGestel (Fast Response)
app.get("/", (req, res) => res.status(200).json({ status: "success", message: "Bot Server Active" }));
app.get("/webhook", (req, res) => res.status(200).json({ status: "success", message: "Webhook Ready" }));

// 2. Endpoint Inti (Tahan Banting & Fast Response)
app.post("/webhook", (req, res) => {
  // JURUS KEBAL PAUSED: Langsung tembak 200 OK di milidetik pertama!
  res.status(200).json({ success: true, message: "Received" });

  // Sisa prosesnya dijalanin di background secara mandiri
  (async () => {
    try {
      const body = req.body || {};

      // Filter event: Kalo bukan SMS, abaikan & stop proses
      if (body.event && !["message.received", "sms.received", "sms"].includes(body.event)) {
        console.log("Ignored non-SMS event:", body.event);
        return;
      }

      let rawText = "";
      if (typeof body === "string") {
        rawText = body;
      } else if (typeof body === "object" && body !== null) {
        rawText = body.text || body.message || body.sms || body.otp || body.code || (body.data && body.data.text) || JSON.stringify(body, null, 2);
      } else {
        rawText = String(body);
      }

      // Kalo datanya kosong banget, gausah kirim ke tele
      if (!rawText || rawText === "{}" || rawText.trim() === "") return;

      // Ekstrak angka OTP 4-8 digit
      const otpMatch = rawText.match(/\b\d{4,8}\b/);
      const otpCode = otpMatch ? otpMatch[0] : rawText;

      const flag = getFlag(body);
      const formattedText = `<b>${flag} [ KEMFOT OTP RECEIVER ]</b>\n\nPesan: <code>${rawText}</code>`;

      // Eksekusi tembak ke Telegram
      await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        chat_id: CHAT_ID,
        text: formattedText,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              { text: `📋 OTP: ${otpCode}`, url: "https://t.me/Kemfot" }
            ],
            [
              { text: "📁 File", url: "https://t.me/Kemfot" },
              { text: "💬 Diskusi", url: "https://t.me/kemfotdisc" }
            ]
          ]
        }
      });
      console.log("Success sent to Telegram");

    } catch (err) {
      console.error("Error processing webhook in background:", err.message);
    }
  })();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
