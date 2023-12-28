const nodemailer = require('nodemailer');

function generateNamespace(length = 6) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
   var charactersLength = characters.length;
   for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
};

function sendEmail(email) {
   const title = "Email from nodemail";
   const message = "Some message";
   const html = "<h1>Test</h1>"

   const transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,
      port: process.env.SMTP_PORT,
      auth: {
         user: process.env.SMTP_USER,
         pass: process.env.SMTP_PASS
      }
   });

   async function main() {
      const info = await transporter.sendMail({
         from: process.env.SMTP_USER,
         to: email,
         subject: title,
         text: message,
         html: html,
      });

      console.log("Message sent: %s", info.messageId);
   }

   return main();
}

module.exports = {
   generateNamespace: generateNamespace,
   sendemail: sendEmail,
}