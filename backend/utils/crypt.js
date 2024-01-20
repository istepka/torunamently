// crypt.js
import bcrypt from "bcrypt";
const salt = "$2b$10$8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z";

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, salt);
}

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}
