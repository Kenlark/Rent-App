import { StatusCodes } from "http-status-codes";
import { Resend } from "resend";

const resend = new Resend(process.env.API_KEY_RESEND);

const sendEmail = async (req, res) => {
  const { from, to, subject, html } = req.body;

  if (!from || !to || !subject || !html) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Tous les champs sont requis" });
  }

  try {
    const data = await resend.emails.send({
      from,
      to: [to],
      subject,
      html,
    });

    return res.status(StatusCodes.OK).json({ data });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Erreur lors de l'envoi de l'email", error: error.message });
  }
};

export default sendEmail;
