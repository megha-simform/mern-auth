import User from "../models/user.js";
import AccessToken from "../models/accessToken.js";
import RefreshToken from "../models/refreshToken.js";
import {
  createHash,
  generateHelperToken,
  generateToken,
  matchPassword,
} from "../utils/helper.js";
import jsonwebtoken from "jsonwebtoken";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;
const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;
const refreshTokenExpiryTime = process.env.REFRESH_TOKEN_EXPIRY_TIME;
const accessTokenExpiryTime = process.env.ACCESS_TOKEN_EXPIRY_TIME;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.MAILER_USER_ID,
    pass: process.env.MAILER_PASSWORD,
  },
});

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
    // Extract data from the request body
    const { name, email, password, confirmPassword } = req.body;

    // Check if the password and confirm password match
    if (password !== confirmPassword) {
      return res
        .status(403)
        .json({ message: "Password and Confirm Password must match." });
    } else {
      // Create a hashed password
      const hashedPassword = createHash(password);
      const verifyEmailToken = await generateHelperToken();

      // Create a new user object
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
        verifyEmailToken: verifyEmailToken,
        // gender: gender,
      });
      // Save the user in the database
      user
        .save()
        .then((user) => {
          const url = `http://localhost:5173/auth/verify-email/?${verifyEmailToken}`;
          transporter.sendMail(
            {
              from: '"POC" <mern-auth@poc.com>',
              to: email,
              subject: "Verify Your Email",
              html: `<h2>Please click on the link below to verify your email.</h2><br><a href=${url}>Verify Your Email</a>`,
              // text: "Hey, I'm being sent from the cloud",
            },
            function (error, info) {
              if (error) {
                return res.status(500).json({
                  message:
                    "Internal Server Error. Not able to send verification email.",
                });
              } else {
                return res.status(200).json({
                  message: "Verification mail sent.",
                });
              }
            }
          );

          // Return a success response if the user is saved successfully
          return res.status(200).json({
            message: "Verification Email is sent. Please verify to login.",
          });
        })
        .catch((error) => {
          // Handle specific error cases
          if (error.code === 11000) {
            return res.status(400).json({
              error:
                "This email already exists. Please try with a different email",
            });
          }
          console.log(error, "Error in postSignup");
          return res.status(500).json({ error: "INTERNAL SERVER ERROR" });
        });
    }
  } catch (error) {
    // Handle any unexpected errors
    console.log("Error in postSignup", error);
    return res.status(500).json({ error: "INTERNAL SERVER ERROR" });
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
      return res
        .status(400)
        .json({ error: "Email or Password field is empty." });
    }

    // Find the user based on the email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(400).json({
        error: "User does not exist. Please signup to login.",
      });
    } else {
      // Check if access token and refresh token exist for the user
      const accessTokenExists = await AccessToken.findOne({ userId: user._id });
      const refreshTokenExists = await RefreshToken.findOne({
        userId: user._id,
      });

      if (accessTokenExists && matchPassword(user.password ?? "", password)) {
        // Return a success response if the user is already logged in
        res.status(200).json({
          message: "User is already logged in.",
          accessToken: accessTokenExists,
        });
      } else if (
        refreshTokenExists &&
        matchPassword(user.password ?? "", password)
      ) {
        // Return a message to generate a new access token using the refresh token
        res.status(200).json({
          message:
            "User's refresh token exists. Please make a POST request to the refresh-token endpoint to create a new access token",
        });
      } else {
        if (matchPassword(user.password ?? "", password)) {
          console.log(user, ACCESS_TOKEN_SECRET_KEY, accessTokenExpiryTime);
          // Generate new access token and refresh token
          const accessToken = generateToken(
            user._id,
            ACCESS_TOKEN_SECRET_KEY,
            accessTokenExpiryTime
          );
          const refreshToken = generateToken(
            user._id,
            REFRESH_TOKEN_SECRET_KEY,
            refreshTokenExpiryTime
          );

          // Save the access token and refresh token in the database
          await AccessToken.create({
            accessToken: accessToken,
            userId: user._id,
          });
          await RefreshToken.create({
            refreshToken: refreshToken,
            userId: user._id,
            valid: true,
          });

          // Return success response with access token and refresh token
          return res.status(200).json({
            user: { name: user.name, email: user.email },
            message: `${user.name} is logged in.`,
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
        } else {
          // Return error response for wrong password
          res.status(400).json({ error: "Wrong Password" });
        }
      }
    }
  } catch (error) {
    // Handle any unexpected errors
    console.log("Error in postLogin", error);
    return res.status(500).json({
      error: "INTERNAL SERVER ERROR WHILE LOGGING IN.",
    });
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

  const accessToken = req.headers["authorization"]
    ? req.headers["authorization"].split(" ")[1]
    : req.headers["authorization"];
  console.log(accessToken, req.headers, "heyy");
  // If access token is not found, return an error response
  if (!accessToken) {
    return res.status(403).json({
      message:
        "Access Token not found. User might have been logged out already.",
    });
  }
  // Verify the access token
  jsonwebtoken.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET_KEY ?? "",
    async (error, decoded) => {
      // If the access token is invalid, return an error response
      if (error) {
        return res.status(401).json({ message: "INVALID TOKEN" });
      }

      try {
        const { userId } = decoded;
        console.log(decoded);
        // Delete the corresponding access token and refresh token from the database
        await AccessToken.findOneAndDelete({ userId });
        await RefreshToken.findOneAndDelete({ userId });

        // Return a success response indicating successful logout
        return res
          .status(200)
          .json({ message: "User logged out successfully." });
      } catch (err) {
        console.log("Error in postLogout:", err);
        return res.status(500).json({
          error: "INTERNAL SERVER ERROR WHILE LOGGING IN.",
        });
      }
    }
  );
}

/**
 * Generate a new access token using the provided refresh token.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<Response>} - The response containing the new access token.
 */
export async function postRefreshToken(req, res, next) {
  try {
    const refreshToken = req.headers["authorization"]
      ? req.headers["authorization"].split(" ")[1]
      : req.headers["authorization"];
    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh Token not found. Unauthenticated user.",
      });
    }

    jsonwebtoken.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      async (error, decoded) => {
        if (error) {
          return res.status(403).json({
            message: "Refresh token expired. User needs to login again.",
          });
        }

        try {
          const userId = decoded.userId;

          // Check if the refresh token is valid
          const refreshTokenDetails = await RefreshToken.findOne({
            refreshToken: refreshToken,
          }).where({
            userId: userId,
          });

          if (!refreshTokenDetails) {
            return res.status(401).json({
              message: "INVALID REFRESH TOKEN. User needs to login again.",
            });
          }

          // Delete any existing access tokens for the user
          const deleteUnwantedAccessToken = await AccessToken.findOne({
            userId: userId,
          });
          if (deleteUnwantedAccessToken) {
            await AccessToken.findOneAndDelete({ userId: userId });
          }

          // Generate a new access token
          const accessToken = generateToken(
            userId,
            ACCESS_TOKEN_SECRET_KEY,
            accessTokenExpiryTime
          );
          await AccessToken.create({
            accessToken: accessToken,
            userId: userId,
          });

          return res.status(200).json({
            message: "Access Token generated.",
            accessToken: accessToken,
          });
        } catch (error) {
          console.log(
            "Error in postRefreshToken jsonwebtoken verification: ",
            error
          );
        }
      }
    );
  } catch (error) {
    console.log("Error in postRefreshToken: ", error);
  }
}

export function postChangePassword(req, res, next) {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;
  const accessToken = req.headers["authorization"]
    ? req.headers["authorization"].split(" ")[1]
    : req.headers["authorization"];

  // If access token is not found, return an error response
  if (!accessToken) {
    return res.status(403).json({
      message:
        "Access Token not found. User might have been logged out already.",
    });
  }

  jsonwebtoken.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET_KEY ?? "",
    async (error, decoded) => {
      // If the access token is invalid, return an error response
      if (error) {
        return res.status(401).json({ message: "INVALID TOKEN" });
      }

      try {
        const { userId } = decoded;
        let objectId = new mongoose.Types.ObjectId(userId); // id as a string is passed
        const user = await User.findOne({ _id: objectId });

        if (!matchPassword(user.password ?? "", oldPassword)) {
          return res
            .status(403)
            .json({ message: "Wrong/Invalid current password." });
        } else if (newPassword !== confirmPassword) {
          return res
            .status(403)
            .json({ message: "Password and Confirm Password must match." });
        } else {
          await User.updateOne(
            { _id: user._id },
            { $set: { password: createHash(newPassword) } }
          );
          return res.status(200).json({
            message: "Password changed successfully.",
          });
        }
      } catch (err) {
        console.log("Error in post change password:", err);
        return res.status(500).json({
          error: "INTERNAL SERVER ERROR.",
        });
      }
    }
  );
}
export async function postForgotPassword(req, res, next) {
  const email = req.body.email;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      error: "Invalid EmailID. Please enter correct EmailID",
    });
  } else {
    const forgotPasswordToken = await generateHelperToken();
    await User.updateOne({ _id: user._id }, { $set: { forgotPasswordToken } });

    const url = `http://localhost:5173/auth/forgot-password/?${forgotPasswordToken}`;
    transporter.sendMail(
      {
        from: '"POC" <mern-auth@poc.com>',
        to: email,
        subject: "Reset Your Password",
        html: `<h2>Forgot password? You can find your link below</h2><br><a href=${url}>Password Reset Link</a>`,
      },
      function (error, info) {
        if (error) {
          console.log(error);
          return res.status(500).json({ message: "Internal Server Error" });
        } else {
          return res.status(200).json({
            message: "Forgot password api check.",
          });
        }
      }
    );
  }
}

export async function postResetPassword(req, res, next) {
  console.log("reset password", req.params.resetPasswordToken);

  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const resetPasswordToken = req.params.resetPasswordToken;

  if (password !== confirmPassword) {
    return res
      .status(403)
      .json({ message: "Password and Confirm Password must match." });
  } else if (!resetPasswordToken) {
    return res.status(403).json({ message: "Reset Password Token not found." });
  } else {
    const checkUser = await User.findOne({
      resetPasswordToken,
    });

    if (!checkUser) {
      return res.status(403).json({
        message: "Incorrect reset password token or invlid user",
      });
    } else {
      const newPassword = createHash(password);
      await User.updateOne(
        { _id: checkUser._id },
        {
          $set: { password: newPassword, resetPasswordToken: "" },
        }
      );
      return res.status(200).json({
        message: "Password reset successful.",
      });
    }
  }
}

export async function postVerifyEmail(req, res, next) {
  const verifyEmailToken = req.params.verifyEmailToken;

  if (!verifyEmailToken) {
    return res.status(403).json({ message: "Invalid verify token." });
  } else {
    const checkUser = await User.findOne({
      verifyEmailToken,
    });

    if (!checkUser) {
      return res.status(403).json({
        message: "Incorrect verify email token or invalid user",
      });
    } else {
      const user = await User.updateOne(
        { _id: checkUser._id },
        {
          $set: { verifyEmailToken: "verified" },
        }
      );
      return res.status(200).json({
        message: "Email Verification successful.",
      });
    }
  }
}
