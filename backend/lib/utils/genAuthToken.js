import jwt from "jsonwebtoken";

export const genrateAuthTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "12d",
  });

  res.cookie("jwt", token, {
    mexAge: 12 * 24 * 60 * 60 * 1000, //12 day
    httpOnly: true, //xss
    semeSite: "secret",
    secure: process.env.NODE_ENV !== "development",
  });
};
