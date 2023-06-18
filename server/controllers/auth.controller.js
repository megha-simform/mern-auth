import User from '../models/user.js';
import { createHash } from '../utils/helper.js';

/**
 * Handle the signup process.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the signup process is complete.
 */
export default async function postSignup(req, res, next) {
  try {
    // Extract data from the request body
    const { name, email, password, confirmPassword, gender } = req.body;

    // Check if the password and confirm password match
    if (password === confirmPassword) {
      // Create a hashed password
      const hashedPassword = createHash(password);

      // Create a new user object
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
        gender: gender,
      });

      // Save the user in the database
      user
        .save()
        .then((user) => {
          // Return a success response if the user is saved successfully
          return res.status(200).json({ message: 'User created' });
        })
        .catch((error) => {
          // Handle specific error cases
          if (error.code === 11000) {
            return res.status(400).json({ error: 'This email already exists. Please try with a different email' });
          }
          return res.status(500).json({ error: 'INTERNAL SERVER ERROR' });
        });
    } else {
      // Return an error response if the password and confirm password do not match
      return res.status(400).json({ error: 'Password and Confirm Password must match.' });
    }
  } catch (error) {
    // Handle any unexpected errors
    console.log('Error in postSignup', error);
    return res.status(500).json({ error: 'INTERNAL SERVER ERROR' });
  }
}
