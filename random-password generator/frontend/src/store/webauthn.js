import {
  startRegistration,
  startAuthentication,
} from "@simplewebauthn/browser";
import { axiosinstance } from "../lib/axios";

// const API_URL = "http://localhost:5003";

export async function isPlatformAuthenticatorAvailable() {
  if (!window.PublicKeyCredential) {
    return false;
  }

  return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
}

export async function registerBiometric() {
  try {
    const available =
      await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();

    if (!available) {
      throw new Error("Platform authenticator is not available");
    }

    const { data: options } = await axiosinstance.post(
      "/webauthn/register/options",
    );

    const registrationResponse = await startRegistration({
      optionsJSON: options,
    });

    console.log(registrationResponse);
    const { data: result } = await axiosinstance.post(
      "/webauthn/register/verify",
      registrationResponse,
    );

    return result;
  } catch (error) {
    console.error(
      "Biometric registration error:",
      error.response?.data || error,
    );

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Could not register biometric",
    );
  }
}

export async function authenticateWithBiometric() {
  const available = await isPlatformAuthenticatorAvailable();

  if (!available) {
    throw new Error("Platform authenticator is not available");
  }

  const optionsResponse = await axiosinstance.post("/webauthn/login/options");

  const options = optionsResponse.data;

  if (!options) {
    throw new Error("Could not start biometric authentication");
  }

 
  const authenticationResponse = await startAuthentication({
    optionsJSON: options,
  });

  const verifyResponse = await axiosinstance.post(
    "/webauthn/login/verify",
    authenticationResponse,
  );

  const result = verifyResponse.data;

  if (!result) {
    throw new Error("Biometric authentication failed");
  }

  return result;
}
