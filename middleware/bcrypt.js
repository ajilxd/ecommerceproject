const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashPassword = async function(inputPassword) {
    try {
        const hash = await bcrypt.hash(inputPassword, saltRounds);
        return hash;
    } catch (error) {
        throw error;
    }
}

const comparePasswords = async function(plaintextPassword, hashedPassword) {
    try {
        const match = await bcrypt.compare(plaintextPassword, hashedPassword);
        return match;
    } catch (error) {
        throw error;
    }
}

module.exports = { hashPassword,comparePasswords };
