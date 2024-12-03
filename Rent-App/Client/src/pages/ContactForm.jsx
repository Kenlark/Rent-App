import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    from: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/v1/emails", {
        from: formData.from,
        to: "kenzokerachi@hotmail.fr",
        subject: formData.subject,
        html: `<p>${formData.message}</p>`,
      });

      if (response.status === 200) {
        toast.success("Email envoyé avec succès!");
      }
    } catch (error) {
      toast.error("Erreur lors de l'envoi de l'email", error);
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
          <button type="submit" className="btn-submit-form-contact">
            Envoyer
          </button>
        </div>
      </section>
    </form>
  );
};

export default ContactForm;
