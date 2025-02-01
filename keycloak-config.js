const Keycloak = require("keycloak-connect");

const keycloakConfig = {
  realm: "acm-1",
  "auth-server-url": "https://acm-keycloak.azurewebsites.net",
  "ssl-required": "external",
  resource: "acm-client",
  credentials: {
    secret: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsObvR+xn4JFT+GQgV1aaazlBq3qcZnumxWYCET5+SR8d7Lr5mwSmt6lUFsyvc35S4DM7c5dho8x9Rib2mM2+5fNyE0gW0T/QOG/LX7Jp8gVC7TAdlTLMw1/qF+iymOW3cFVT6755yhF91pmo/8r3mc9ip9qOJkCqgfShdk5Nujh6jpqxDNiZyZm5LZwk+t30rHmsAtJbmBvPfCox+R/MYBwFM6csaZTUVXNWHQ41M8xZZzOLGrVqF23rA0e2itDPV3PKEsa9bEKMLkDtJQaxZprRNQlO1KElW1a1o2vVyF/Af7N1ttG4RxWuPbDsUTyHSErdx8aPgPaJSHMVA9AXpwIDAQAB",
  },
  "bearer-only": true,
};
const keycloak = new Keycloak({}, keycloakConfig);

module.exports = keycloak;
