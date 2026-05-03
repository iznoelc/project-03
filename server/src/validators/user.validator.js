/**
 * user.validator.js
 * 
 * Initial validation requirements when a user is created in the database.
 * 
 * @author Izzy Carlson
 */

const Joi = require("joi");

const userSchema = Joi.object({
    uid: Joi.string().required(), // firebase uid,
    displayName: Joi.string().min(1).max(30).required(), // user's display name min 1 character, max 30,
    role: Joi.string().valid("creator", "admin").required(), // user's role - admin or creator,
    accountStatus: Joi.string().valid("active", "disabled").required(),
});

const validateUser = (user) => {
    console.log("Validating user:", user);
    return userSchema.validate(user);
}

module.exports = { validateUser };