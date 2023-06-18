import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import * as jwt from 'jsonwebtoken';

import { saltOrRounds } from '../common/constants.js';

/**
 ** Creates a hash of the provided password using bcrypt.
 *
 * @param {string} password - The password to be hashed.
 * @returns {string} The generated hash.
 */
export const createHash = (password) => bcrypt.hashSync(password, saltOrRounds);

/**
 ** Compares a hashed password with a request password to check for a match.
 *
 * @param {string} hashedPassword - The hashed password stored in the database.
 * @param {string} requestPassword - The password received in the request for comparison.
 * @returns {boolean} Returns true if the passwords match, false otherwise.
 */
export const matchPassword = (hashedPassword, requestPassword) => bcrypt.compareSync(requestPassword, hashedPassword);

/**
 ** Generates a token for a user.
 *
 * @param {import('mongoose').Types.ObjectId} userId - The ID of the user.
 * @param {string} secretKey - The secret key used to sign the token.
 * @param {string} expiryTime - The token expiry time in a string format.
 * @returns {string} The generated token.
 */
export const generateToken = (userId, secretKey, expiryTime) => {
  const tokenExpiryTime = expiryTime + 's';
  return jwt.sign({ userId: userId }, secretKey, { expiresIn: tokenExpiryTime });
};
