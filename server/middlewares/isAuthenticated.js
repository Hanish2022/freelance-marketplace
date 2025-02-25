// middleware/isAuthenticated.js
import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  // Expecting the token to be sent in the "Authorization" header as "Bearer <token>"
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "No token provided, authorization denied." });
  }

  const token = authHeader.split(" ")[1]; // Extract the token part

  try {
    // Verify token using the secret from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the decoded payload to the request object for further use
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Token is not valid or has expired." });
  }
};
