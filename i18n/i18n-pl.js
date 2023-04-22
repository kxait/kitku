const labels = {
  BAD_LOGIN: "Zły adres e-mail lub hasło",
  SYSTEM_ERROR: "Błąd systemu",
};

const getLabel = (label) => labels[label];

module.exports = {
  labels,
  getLabel,
};
