const labels = {
  BAD_LOGIN: "Zły adres e-mail lub hasło",
  SYSTEM_ERROR: "Błąd systemu",
  PASSWORDS_NOT_SAME: "Hasła nie są takie same",
  EMAIL_OR_PHONE_EXISTS:
    "Konto o podanym adresie e-mail lub numerze telefonu już istnieje",
  ADOPTION_STATUS_0: "Nowa",
  ADOPTION_STATUS_1: "W trakcie sprawdzania",
  ADOPTION_STATUS_2: "Brak informacji. Skontakuj się z nami",
  ADOPTION_STATUS_3: "Kot znalazł nowy dom!",
  ADOPTION_STATUS_4: "Adopcja anulowana",
  NO_EMPLOYEE: "Brak",
  EVENT_TYPE_0: "Stworzona",
  EVENT_TYPE_1: "Stworzona",
  EVENT_TYPE_2: "Zmiana statusu",
};

const getLabel = (label) => labels[label];

module.exports = {
  labels,
  getLabel,
};
