const { createError } = require("./error");

/**
 * Validates fields of an entity based on specified rules.
 *
 * @param {Object} entityToValidate - The entity object to validate.
 * @param {Object} rules - The validation rules where keys are field names and values are error messages.
 * @param {string[]} fieldsToValidate - The list of fields to validate against the rules.
 * @throws {Error} Throws an error if the entity to validate, rules, or fields to validate are undefined or empty,
 *   or if any of the specified fields do not exist in the entity.
 *
 * @example
 * const user = { firstname: 'John', lastname: 'Doe', email: 'john.doe@example.com' };
 * const validationRules = {
 *   firstname: "Firstname",
 *   lastname: "Lastname",
 *   email: "Email"
 * };
 * validateFields(user, validationRules, ['firstname', 'email']); // No error thrown
 * validateFields(user, validationRules, ['password']); // Throws error: "Password cannot be undefined"
 */
const validateFields = (entityToValidate, rules, fieldsToValidate) => {
  if (!entityToValidate || Object.keys(entityToValidate).length === 0)
    throw createError(400, "Entity to validate cannot be undefined or empty");
  if (!rules || Object.keys(rules).length === 0)
    throw createError(400, "Rules cannot be undefined or empty");
  if (!fieldsToValidate || fieldsToValidate.length === 0)
    throw createError(400, "Fields to validate cannot be undefined or empty");

  fieldsToValidate.forEach((field) => {
    if (rules[field] && !entityToValidate[field]) {
      throw createError(400, `${rules[field]} cannot be undefined`);
    }
  });
};

module.exports = {
  validateFields,
};
