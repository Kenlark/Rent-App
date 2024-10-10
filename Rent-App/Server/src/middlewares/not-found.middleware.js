const notFound = (req, res) => {
  res.status(404).json({ msg: "La route n'existe pas" });
};

export default notFound;
