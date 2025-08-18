import dotenv from "dotenv";

dotenv.config();

/**
 * Function to get an environment variable by name.
 * @param {string} variable - The name of the environment variable to retrieve.
 * @throws {Error} - If the environment variable is not defined.
 */
export const getEnvVar = (variable: string) => {
  const value = process.env[variable];

  if (!value) {
    throw new Error(`Environment variable ${variable} is not defined`);
  }

  return value;
};
