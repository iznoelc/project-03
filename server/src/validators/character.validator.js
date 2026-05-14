/**
 * character.validator.js
 * 
 * Validate a character either on first post or edit.
 * 
 * @author Izzy Carlson
 */

const Joi = require("joi");

// creating a new character
const newCharacterSchema = Joi.object({
    owner_uid: Joi.string().required(),
    name: Joi.string().required(), // 4 to 15 char username, lowercase only, a-z, 0-9, and underscores
    bio: Joi.string().required(),
    creator: Joi.string().required(), // user's role - admin or creator,
    iconImg: Joi.string().required(),
    referenceImg: Joi.string().optional().allow(""),
    vis: Joi.string().required().valid("public", "private"),
    exportable: Joi.bool().required(),
    link: Joi.string().optional().allow(""),
    tags: Joi.array().items(Joi.string()).max(3).optional(),
});

// // editing profile 
// const editProfileSchema = Joi.object({
//     username: usernameSchema,
//     displayName: displayNameSchema,
//     bio: bioSchema,
// }).min(1); // make sure one field at least is provided when patching profile

const validateNewCharacter = (character) => {
    console.log("Validating Character:", character);
    return newCharacterSchema.validate(character);
}

// const validateEditedProfile = (user) => {
//     console.log("Validating edited profile on patch:", user);
//     return editProfileSchema.validate(user);
// }

module.exports = { validateNewCharacter };