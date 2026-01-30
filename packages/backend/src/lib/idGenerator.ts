import { customAlphabet } from "nanoid";

const CHARACTER_LIST =
  "abcdefghjkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ123456789";

const ID_LENGTH = 10

export const generateId = (size: number = ID_LENGTH) => {
  return customAlphabet(CHARACTER_LIST, size)();
};
