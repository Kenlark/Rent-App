import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
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
        to: formData.to,
        subject: formData.subject,
        html: `<p>${formData.message}</p>`,
      });

      if (response.status === 200) {
        toast.success("Email envoyé avec succès!");
      }
    } catch (error) {
      toast.error("Erreur lors de l'envoi de l'email");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>De :</label>
        <input
          type="email"
          name="from"
          value={formData.from}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>À :</label>
        <input
          type="email"
          name="to"
          value={formData.to}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Sujet :</label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Message :</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Envoyer</button>
    </form>
  );
};

export default ContactForm;
