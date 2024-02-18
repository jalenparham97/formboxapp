import { customAlphabet } from "nanoid";

const alphabet = "abcdefghijklmnopqrstuvwxyz";

export const nanoid = (size: number = 21) => customAlphabet(alphabet, size)();
