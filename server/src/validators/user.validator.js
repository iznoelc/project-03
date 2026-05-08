/**
 * user.validator.js
 * 
 * Initial validation requirements when a user is created in the database.
 * 
 * @author Izzy Carlson
 */

const Joi = require("joi");

const usernameSchema = Joi.string().min(4).max(15).lowercase().pattern(/^[a-z0-9_]+$/); // username schema
const displayNameSchema = Joi.string().min(1).max(30); // user's display name min 1 character, max 30
const bioSchema = Joi.string().max(200)

// creating a new user
const userSchema = Joi.object({
    uid: Joi.string().required(), // firebase uid,
    username: usernameSchema.required(), // 4 to 15 char username, lowercase only, a-z, 0-9, and underscores
    displayName: displayNameSchema.required(),
    role: Joi.string().valid("creator", "admin").required(), // user's role - admin or creator,
    accountStatus: Joi.string().valid("active", "disabled").required(),
});

// editing profile 
const editProfileSchema = Joi.object({
    username: usernameSchema,
    displayName: displayNameSchema,
    bio: bioSchema,
}).min(1); // make sure one field at least is provided when patching profile

const validateUser = (user) => {
    console.log("Validating user:", user);
    return userSchema.validate(user);
}

const validateEditedProfile = (user) => {
    console.log("Validating edited profile on patch:", user);
    return editProfileSchema.validate(user);
}

module.exports = { validateUser, validateEditedProfile };