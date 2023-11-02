import nodemailer from "nodemailer" 
export default async function sendVerified(email: string, token: string) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL!,
        pass: process.env.PASS_EMAIL!,
      },
    });
  
    const mailOptions = {
      from: process.env.USER_EMAIL!,
      to: email,
      subject: "Sending Email using Node.js",
      text: "That was easy!",
      html: `<a href='${process.env.URL}/api/v1/users/verifie/${token}'>Verifie Email</a>`,
    };
  
    const info = await transporter.sendMail(mailOptions);
  
    console.log("Email sent: " + info.response);
  }