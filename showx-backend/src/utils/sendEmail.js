import nodemailer from "nodemailer";

// This function creates a "transporter" — basically a connection to Gmail's
// SMTP server that knows how to send emails using our App Password.
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // your Gmail address, from .env
      pass: process.env.EMAIL_PASS, // the 16-letter App Password, from .env
    },
  });
};

// sendEmail is a reusable function — any part of our app can call this
// to send an email. It takes an object with "to", "subject", and "html".
const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();

  const mailOptions = {
    // "from" controls what the recipient SEES as the sender name and email.
    // This is where "ShowX CinemaHub" will show up in their inbox.
    from: `"ShowX CinemaHub" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  // This actually sends the email through Gmail's servers.
  await transporter.sendMail(mailOptions);
};

export default sendEmail;