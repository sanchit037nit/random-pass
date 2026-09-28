import jwt from "jsonwebtoken"

export const generateToken = (userId, res) => {
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });

    return token;
};

export const generateVaultToken = (userId, res) => {
    const token = jwt.sign(
        { userId, vaultUnlocked: true },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    res.cookie("vault_jwt", token, {
        maxAge: 1 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });

    return token;
};