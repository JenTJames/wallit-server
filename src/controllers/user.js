const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { createError } = require("../lib/error");
const { validateFields } = require("../lib/helpers");

/**
 * Creates a new user based on the request body, validates the user object,
 * and handles errors by passing them to the next middleware.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
const createUser = async (req, res, next) => {
  const user = req.body;
  try {
    validateUser(user, ["firstname", "lastname", "email", "password"]);

    // check if the email is duplicate
    await validateEmail(user.email);

    // hash passwords
    const hashedPassword = await bcrypt.hash(user.password, 12);
    user.password = hashedPassword;
    // save user
    const savedUser = await User.create(user);
    res.status(201).send(`${savedUser.getDataValue("id")}`);
  } catch (error) {
    next(error, req, res, next);
  }
};

/**
 * Authenticates a user based on provided credentials, validates the credentials,
 * and handles errors by passing them to the next middleware.
 *
 * @param {import('express').Request} req - The Express request object
 * @param {import('express').Response} res - The Express response object
 * @param {import('express').NextFunction} next - The next middleware function
 * @returns {Promise<void>}
 */
const authenticateUser = async (req, res, next) => {
  const credentials = req.body;
  try {
    validateUser(credentials, ["email", "password"]);
    const user = await User.findOne({
      where: {
        email: credentials.email,
      },
    });
    if (!user) throw createError(401, "Invalid credentials");
    const isValid = await bcrypt.compare(credentials.password, user.password);
    if (!isValid) throw createError(401, "Invalid credentials");
    res.status(200).send({ ...user.dataValues, password: undefined });
  } catch (error) {
    next(error, req, res, next);
  }
};

/**
 * This method will return a user object with the given email and handles errors by passing them to the next middleware
 *
 * @param {import('express').Request} req - The Express Request object
 * @param {import('express'). Response} res - The Express Response object
 * @param {import('express').NextFunction} next - The next middleware function
 * @returns {Promise<void>}
 */
const findUserByEmail = async (req, res, next) => {
  const { email } = req.query;
  try {
    const user = await getUserByEmail(email);
    res.status(200).send(user.dataValues);
  } catch (error) {
    next(error, req, res, next);
  }
};

/**
 * This method will fetch the database instance of a user by the email field. It will throw errors if the email is undefined or a user is not found with the given email
 *
 * @param {String} email - The email of the user
 * @returns The found user's database instance setting only id, firstname, lastname and email
 */
const getUserByEmail = async (email) => {
  if (!email) throw createError(400, "Invalid email");
  const user = await User.findOne({
    where: {
      email,
    },
    attributes: ["id", "firstname", "lastname", "email"],
  });
  if (!user)
    throw createError(400, "Could not find a user with the given email");
  return user;
};

/**
 * This method will return a user with the given ID
 *
 * @param {Number} id - The ID of the user to find
 * @returns - The fetched user with the given ID
 * @throws - Error with code 400 if the ID is undefined or if a user with the given ID is not found
 */
const getUserById = async (id) => {
  if (!id) throw createError(400, "User ID cannot be undefined");
  const user = await User.findByPk(id);
  if (!user)
    throw createError(
      400,
      "A user with the given ID " + id + " could not be found"
    );
  return user;
};

/**
 * Validates a user object based on specified fields and throws errors if validation fails.
 *
 * @param {Object} user - The user object to validate.
 * @param {string[]} [fieldsToValidate=[]] - The list of fields to validate. If not provided, all fields defined in validationRules will be validated.
 * @throws {Error} Throws an error if the user object is undefined or any required fields are missing or empty.
 *
 * @example
 * const user = { id: 1, firstname: 'John', lastname: 'Doe', email: 'john.doe@example.com' };
 * validateUser(user, ['firstname', 'email']); // No error thrown
 * validateUser(user); // Validates all fields in user object based on validationRules
 */
const validateUser = (user, fieldsToValidate = []) => {
  if (!user) throw createError(400, "User cannot be undefined");

  const validationRules = {
    id: "ID",
    firstname: "Firstname",
    lastname: "Lastname",
    email: "Email",
    password: "Password",
  };
  validateFields(user, validationRules, fieldsToValidate);
};

/**
 * This method will check if an email is already registered with the application.
 *
 * @param {String} email - The Email to validate
 * @throws {Error} Throws an error with status 409 if email is already taken. It will also throw an error with code 400 if the given email is undefined
 */
const validateEmail = async (email) => {
  if (!email) throw createError(400, "Email cannot be undefined");
  const user = await User.findOne({
    where: {
      email,
    },
  });
  if (user) throw createError(409, "This email is already taken.");
};

module.exports = {
  createUser,
  getUserById,
  findUserByEmail,
  authenticateUser,
};
