const AdoptionEvent = {
  CREATED_ADOPTION_NEW_USER: 0,
  CREATED_ADOPTION_EXISTING_USER: 1,
  ADOPTION_STATUS_CHANGED: 2,
};

const AdoptionStatus = {
  BEGAN: 0,
  EVALUATING: 1,
  MISSING_INFO: 2,
  SUCCESS: 3,
  FAIL: 4,
};

const UserType = {
  USER: 0,
  ADMIN: 1,
};

module.exports = {
  AdoptionEvent,
  AdoptionStatus,
  UserType,
};
