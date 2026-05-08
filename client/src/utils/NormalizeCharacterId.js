export const normalizeId = (character) =>
    typeof character === "string"
        ? character
        : character._id; 