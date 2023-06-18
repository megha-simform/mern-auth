import User from '../models/user.js';
import AccessToken from '../models/accessToken.js';
import RefreshToken from '../models/refreshToken.js';
import { createHash } from '../utils/helper.js';

const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;
const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;
const refreshTokenExpiryTime = process.env.REFRESH_TOKEN_EXPIRY_TIME;
const accessTokenExpiryTime = process.env.ACCESS_TOKEN_EXPIRY_TIME;

/**
 * Handle the signup process.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the signup process is complete.
 */
export async function postSignup(req, res, next) {
  try {
    console.log('hi');
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

/**
 * Handle the login process.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the login process is complete.
 */
export async function postLogin(req, res, next) {
  try {
    // Extract email and password from the request body
    const email = req.body.email;
    const password = req.body.password;

    // Check if email or password is empty
    if (!email || !password) {
      return res.status(400).json({ error: 'Email or Password field is empty.' });
    }

    // Find the user based on the email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(400).json({ error: 'User does not exist. Please signup to login.' });
    } else {
      // Check if access token and refresh token exist for the user
      const accessTokenExists = await AccessToken.findOne({ userId: user._id });
      const refreshTokenExists = await RefreshToken.findOne({ userId: user._id });

      if (accessTokenExists && matchPassword(user.password ?? '', password)) {
        // Return a success response if the user is already logged in
        res.status(200).json({ message: 'User is already logged in.', accessToken: accessTokenExists });
      } else if (refreshTokenExists && matchPassword(user.password ?? '', password)) {
        // Return a message to generate a new access token using the refresh token
        res.status(200).json({
          message:
            "User's refresh token exists. Please make a POST request to the refresh-token endpoint to create a new access token",
        });
      } else {
        if (matchPassword(user.password ?? '', password)) {
          // Generate new access token and refresh token
          const accessToken = generateToken(user._id, ACCESS_TOKEN_SECRET_KEY, accessTokenExpiryTime);
          const refreshToken = generateToken(user._id, REFRESH_TOKEN_SECRET_KEY, refreshTokenExpiryTime);

          // Save the access token and refresh token in the database
          await AccessToken.create({ accessToken: accessToken, userId: user._id });
          await RefreshToken.create({ refreshToken: refreshToken, userId: user._id, valid: true });

          // Return success response with access token and refresh token
          return res
            .status(200)
            .json({ message: `${user.name} is logged in.`, accessToken: accessToken, refreshToken: refreshToken });
        } else {
          // Return error response for wrong password
          res.status(400).json({ error: 'Wrong Password' });
        }
      }
    }
  } catch (error) {
    // Handle any unexpected errors
    console.log('Error in postLogin', error);
    return res.status(500).json({ error: 'INTERNAL SERVER ERROR WHILE LOGGING IN.' });
  }
}

/**
 * Handle the logout process.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the logout process is complete.
 */
export async function postLogout(req, res, next) {
  // Extract the access token from the request headers
  const accessToken = req.headers['authorization'];

  // If access token is not found, return an error response
  if (!accessToken) {
    return res.status(400).json({ message: 'Access Token not found. User might have been logged out already.' });
  }

  // Verify the access token
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY ?? '', async (error, decoded) => {
    // If the access token is invalid, return an error response
    if (error) {
      return res.status(403).json({ message: 'INVALID TOKEN' });
    }

    try {
      const { userId } = decoded;

      // Delete the corresponding access token and refresh token from the database
      await AccessToken.findOneAndDelete({ userId });
      await RefreshToken.findOneAndDelete({ userId });

      // Return a success response indicating successful logout
      return res.status(200).json({ message: 'User logged out successfully.' });
    } catch (err) {
      console.log('Error in postLogout:', err);
      return res.status(500).json({ error: 'INTERNAL SERVER ERROR WHILE LOGGING IN.' });
    }
  });
}
