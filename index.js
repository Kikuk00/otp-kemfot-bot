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
    { flag: "🇧🇯", keys: ["benin", "+229", " bj "] },
    { flag: "🇲🇱", keys: ["mali", "+223", " ml "] },
    { flag: "🇹🇬", keys: ["togo", "+228", " tg "] },
    { flag: "🇿🇼", keys: ["zimbabwe", "+263", " zw "] },
    { flag: "🇵🇪", keys: ["peru", "+51", " pe "] },
    { flag: "🇱🇰", keys: ["sri lanka", "srilangka", "+94", " lk "] },
    { flag: "🇸🇩", keys: ["sudan", "+249", " sd "] },
    { flag: "🇦🇫", keys: ["afghanistan", "+93", " af "] },
    { flag: "🇹🇯", keys: ["tajikistan", "+992", " tj "] },
    { flag: "🇦🇿", keys: ["azerbaijan", "+994", " az "] },
    { flag: "🇮🇩", keys: ["indonesia", "+62", " id "] },
    { flag: "🇩🇪", keys: ["germany", "jerman", "+49", " de "] },
    { flag: "🇵🇾", keys: ["paraguay", "+595", " py "] },
    { flag: "🇵🇰", keys: ["pakistan", "+92", " pk "] },
    { flag: "🇵🇭", keys: ["philippines", "filipina", "+63", " ph "] },
    { flag: "🇺🇸", keys: ["united states", "usa", "+1", " us "] },
    { flag: "🇷🇺", keys: ["russia", "rusia", "+7", " ru "] },
    { flag: "🇬🇧", keys: ["united kingdom", "uk", "+44", " gb "] },
    { flag: "🇻🇳", keys: ["vietnam", "+84", " vn "] },
    { flag: "🇧🇷", keys: ["brazil", "brasil", "+55", " br "] },
    { flag: "🇮🇳", keys: ["india", "+91", " in "] },
    { flag: "🇲🇾", keys: ["malaysia", "+60", " my "] },
    { flag: "🇹🇭", keys: ["thailand", "+66", " th "] },
    { flag: "🇳🇬", keys: ["nigeria", "+234", " ng "] }
  ];

  for (const item of flags) {
    if (item.keys.some(key => str.includes(key))) return item.flag;
  }
  return "🌐";
}

app.post("/webhook", async (req, res) => {
  try {
    const body = req.body || {};
    let rawText = "";
    if (typeof body === "string") {
      rawText = body;
    } else if (typeof body === "object" && body !== null) {
      rawText = body.message || body.sms || body.text || body.otp || body.code || JSON.stringify(body, null, 2);
    } else {
      rawText = String(body);
    }

    const flag = getFlag(body);
    const formattedText = `<b>${flag} [ KEMFOT OTP RECEIVER ]</b>\n\n<code>${rawText}</code>`;

    await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: formattedText,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "📁 File", url: "https://t.me/Kemfot" },
            { text: "💬 Diskusi", url: "https://t.me/kemfotdisc" }
          ]
        ]
      }
    });

    res.status(200).send("OK");
  } catch (err) {
    res.status(500).send("Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
