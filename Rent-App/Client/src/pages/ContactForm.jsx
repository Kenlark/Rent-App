import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ContactForm = () => {
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaCorrectAnswer, setCaptchaCorrectAnswer] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    from: "",
    subject: "",
    message: "",
  });

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    const question = `${num1} + ${num2}`;
    const correctAnswer = num1 + num2;

    setCaptchaQuestion(question);
    setCaptchaCorrectAnswer(correctAnswer);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseInt(formData.captcha_answer) !== captchaCorrectAnswer) {
      toast.error("Votre réponse au Captcha est incorrect");
      return;
    }

    try {
      setIsSending(true);
      const response = await axios.post(`${API_BASE_URL}/api/v1/emails`, {
        from: formData.from,
        to: "kenzokerachi@hotmail.fr",
        subject: formData.subject,
        html: `<p>${formData.message}</p>`,
      });

      if (response.status === 200) {
        toast.success("Email envoyé avec succès!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
        setFormData({
          from: "",
          subject: "",
          message: "",
        });
      }
    } catch (error) {
      toast.error("Erreur lors de l'envoi de l'email", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-contact">
      <section className="form-contact-bcg">
        <div className="flex-form-contact">
          <h1>Nous Contacter</h1>
          <p>
            Votre avis est important pour nous. Veuillez nous faire savoir
            comment nous pouvons vous aider.
          </p>
          <div className="form-group">
            <input
              type="email"
              name="from"
              className="form-input-contact"
              placeholder=" "
              value={formData.from}
              onChange={handleChange}
              required
            />
            <label htmlFor="subject" className="form-label">
              De :
            </label>
          </div>
          <div className="form-group">
            <input
              type="text"
              name="subject"
              className="form-input-contact"
              placeholder=" "
              value={formData.subject}
              onChange={handleChange}
              required
            />
            <label htmlFor="subject" className="form-label">
              Sujet :
            </label>
          </div>
          <div className="form-group">
            <textarea
              name="message"
              className="text-area-message"
              placeholder=" "
              value={formData.message}
              onChange={handleChange}
              required
            />
            <label htmlFor="message" className="form-label">
              Message :
            </label>
          </div>
          <div className="label-captcha-contact">
            <label>{`Quel est le résultat de : ${captchaQuestion}`}</label>
            <input
              type="number"
              name="captcha_answer"
              value={formData.captcha_answer}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="btn-submit btn-contact"
            disabled={isSending}
          >
            {isSending ? "Envoi en cours..." : "Envoyer"}
          </button>
        </div>
      </section>
    </form>
  );
};

export default ContactForm;
