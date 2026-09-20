import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import dotenv from "dotenv";
import Passkey from "../models/paskey.model.js";

dotenv.config();
const rpName = process.env.WEBAUTHN_RP_NAME;
const rpID = process.env.WEBAUTHN_RP_ID;
const origin = process.env.WEBAUTHN_ORIGIN;

export const registerOptions = async (req, res) => {
  try {
    const user = req.User;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const existingPasskeys = await Passkey.find({
      user: user._id,
    });

    const options = await generateRegistrationOptions({
      rpName,

      rpID,

      userName: user.emailid,

      userID: new TextEncoder().encode(user._id.toString()),

      attestationType: "none",

      excludeCredentials: existingPasskeys.map((passkey) => ({
        id: passkey.credentialID,
        transports: passkey.transports,
      })),

      authenticatorSelection: {
        authenticatorAttachment: "platform",

        residentKey: "preferred",

        userVerification: "required",
      },
    });

    user.webauthnChallenge = options.challenge;

    await user.save();

    res.status(200).json(options);
  } catch (error) {
    console.log("Error generating WebAuthn options:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const registerVerify = async (req, res) => {
  try {
    const user = req.User;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    if (!user.webauthnChallenge) {
      return res.status(400).json({
        success: false,
        message: "WebAuthn challenge missing",
      });
    }

    const verification = await verifyRegistrationResponse({
      response: req.body,

      expectedChallenge: user.webauthnChallenge,

      expectedOrigin: origin,

      expectedRPID: rpID,
    });

    if (!verification.verified) {
      return res.status(400).json({
        success: false,
        message: "Biometric registration failed",
      });
    }

    const registrationInfo = verification.registrationInfo;

    const credential = registrationInfo.credential;

    await Passkey.create({
      user: user._id,

      credentialID: credential.id,

      publicKey: Buffer.from(credential.publicKey).toString("base64"),

      counter: credential.counter,

      transports: credential.transports || [],
    });

  
    user.webauthnChallenge = null;

    await user.save();

    res.status(200).json({
      success: true,

      message: "Biometric unlock enabled",
    });
  } catch (error) {
    console.log("Error verifying WebAuthn registration:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const loginOptions = async (req, res) => {
  try {
    const user = req.User;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const passkeys = await Passkey.find({
      user: user._id,
    });

    if (passkeys.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No biometric credential registered",
      });
    }

    const options = await generateAuthenticationOptions({
      rpID,

      allowCredentials: passkeys.map((passkey) => ({
        id: passkey.credentialID,
        transports: passkey.transports,
      })),

      userVerification: "required",
    });

    user.webauthnChallenge = options.challenge;

    await user.save();

    res.status(200).json(options);
  } catch (error) {
    console.log("Error generating authentication options:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const loginVerify = async (req, res) => {
  try {
    const user = req.User;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    if (!user.webauthnChallenge) {
      return res.status(400).json({
        success: false,
        message: "WebAuthn challenge missing",
      });
    }

    const passkeys = await Passkey.find({
      user: user._id,
    });

    const credentialID = req.body.id;

    const passkey = passkeys.find((key) => key.credentialID === credentialID);

    if (!passkey) {
      return res.status(400).json({
        success: false,
        message: "Credential not found",
      });
    }

    const verification = await verifyAuthenticationResponse({
      response: req.body,

      expectedChallenge: user.webauthnChallenge,

      expectedOrigin: origin,

      expectedRPID: rpID,

      credential: {
        id: passkey.credentialID,

        publicKey: Buffer.from(passkey.publicKey, "base64"),

        counter: passkey.counter,

        transports: passkey.transports,
      },
    });

    if (!verification.verified) {
      return res.status(401).json({
        success: false,
        message: "Biometric verification failed",
      });
    }

  
    passkey.counter = verification.authenticationInfo.newCounter;

    await passkey.save();


    user.webauthnChallenge = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Biometric authentication successful",
    });
  } catch (error) {
    console.log("Error verifying authentication:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
