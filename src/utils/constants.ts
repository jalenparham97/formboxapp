export const COMPANY_NAME = "Formbox";

/**
 * The default redirect path after logging in
 */
export const DEFAULT_LOGIN_REDIRECT = "/organizations";

export const EMAIL_REGEX =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

export const NUMBER_REGEX =
  /^(?:-(?:[1-9](?:\d{0,2}(?:,\d{3})+|\d*))|(?:0|(?:[1-9](?:\d{0,2}(?:,\d{3})+|\d*))))(?:.\d+|)$/;

export const PHONE_NUMBER_REGEX =
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;

export const FILTER_TAKE = 10;

export const DEFAULT_REDIRECTS = {
  home: "https://formbox.app",
  formbox: "https://formbox.app",
  auth: "https://app.formbox.app/auth/login",
  signin: "https://app.formbox.app/login",
  login: "https://app.formbox.app/login",
  register: "https://app.formbox.app/signup",
  signup: "https://app.formbox.app/signup",
  app: "https://app.formbox.app",
  dashboard: "https://app.formbox.app",
  settings: "https://app.formbox.app/settings",
  onboarding: "https://app.formbox.co/onboarding",
};

export const submissionErrors = {
  CLOSED: "CLOSED",
  DOMAIN_NOT_ALLOWED: "DOMAIN_NOT_ALLOWED",
  FORM_NOT_FOUND: "FORM_NOT_FOUND",
  LIMIT_REACHED: "LIMIT_REACHED",
} as const;
