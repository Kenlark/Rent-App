import { StatusCodes } from "http-status-codes";
import { Resend } from "resend";

const resend = new Resend(process.env.API_KEY_EMAIL);

const sendEmail = async (req, res) => {
  const { from, to, subject, html } = req.body;

  if (!from || !to || !subject || !html) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Tous les champs sont requis" });
  }

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    html,
  });

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error });
  }

  res.status(StatusCodes.OK).json({ data });
};

export default sendEmail;
