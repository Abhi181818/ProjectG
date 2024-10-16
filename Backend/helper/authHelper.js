import bcrypt from 'bcryptjs';

export const hashPassword = async (password) => {
    try {
        const hashed = await bcrypt.hash(password, 10)
        return hashed
    } catch (error) {
        console.log(error)
    }
}


export const comparePassword = async (password, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword)
        return isMatch
    } catch (error) {
        console.log(error)
    }
}