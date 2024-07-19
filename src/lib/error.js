/**
 * Creates a new Error object with a custom status code and message.
 *
 * @param {number} code - The HTTP status code for the error (default is 500).
 * @param {string} [message] - The error message to display (default is "Oops! something went wrong.").
 * @returns {Error} The created Error object with the specified status code and message.
 */
const createError = (code, message) => {
  const error = new Error(message || "Oops! something went wrong.");
  error.code = code || 500;
  return error;
};

/**
 * Express middleware for handling errors and sending appropriate responses.
 *
 * @param {Error} error - The error object containing status code and message.
 * @param {import('express').Request} _ - The Express request object (unused in this function).
 * @param {import('express').Response} res - The Express response object.
 * @returns {void}
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  if (!error.code) error.code = 500;
  if (!error.message) error.message = "Oops! Something went wrong";

  console.log(`Status Code ${error.code}: ${error.message}`);
  res.status(error.code).send(error.message);
};

module.exports = {
  createError,
  errorHandler,
};
