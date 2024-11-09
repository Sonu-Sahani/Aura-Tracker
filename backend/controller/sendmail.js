import nodemailer from "nodemailer";

async function sendEmail(otp, email) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "monojitbairagi0@gmail.com",
      pass: "maitrmgrfffhydfo",
    },
  });

  const mailOptions = {
    from: "monojitbairagi0@gmail.com",
    to: email,
    subject: "Your OTP Verification Code",
    html: `
      <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; font-family: Arial, sans-serif;">
        <h2 style="text-align: center; color: black;">Aura Tracker OTP Verification</h2>
        <p style="font-size: 16px; color: #555;">Hello,</p>
        <p style="font-size: 16px; color: #555;">Thank you for using our service! Please use the following One-Time Password (OTP) to verify your account:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; color: black;">${otp}</span>
        </div>
        <p style="font-size: 16px; color: #555;">This OTP is valid for only 2 minutes. Please do not share it with anyone for security purposes.</p>
        <p style="font-size: 16px; color: #555;">Best regards,<br>Your Aura Tracker Team</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0;">
        <p style="text-align: center; font-size: 12px; color: #aaa;">If you did not request this OTP, please ignore this email.</p>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent successfully:", info.response);
    }
  });
}

function optGenerator() {
  let otp = Math.floor(Math.random() * 9000 + 1000);
  console.log(otp);
  return otp;
}

const sendmail = {
  sendEmail,
  optGenerator,
};

export default sendmail;
