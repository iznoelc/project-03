/**
 * verifyFirebaseToken.js
 * 
 * Middleware to verify the firebase token.
 * 
 * @author Izzy Carlson
 */

const admin = require("firebase-admin");
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : require("../../constellation-7f808-firebase-admin.json");

// initialize firebase admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

/**
 * Verifies the Firebase token sent in the Authorization header of the request
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const verifyFireBaseToken = async (req, res, next) => {
  // console.log("Header: ", req.headers.authorization);
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "Unauthorized access" });
  }
  const token = req.headers.authorization.split(" ")[1];
  // console.log(token);
  if (!token) {
    return res.status(401).send({ message: "Unauthorized access" });
  }
  // verify token
  try {
    const userInfo = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: userInfo.uid,
      email: userInfo.email,
    }
    // console.log("after token validation", userInfo);
    next();
  } catch {
    console.log("invalid token");
    return res.status(401).send({ message: "Unauthorized access" });
  }
};

module.exports = { verifyFirebaseToken: verifyFireBaseToken };