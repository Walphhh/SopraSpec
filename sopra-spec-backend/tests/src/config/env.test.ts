import { getEnvVar } from "../../../src/config/env";
import dotenv from "dotenv";

describe("getEnvVar", () => {
  beforeAll(() => {
    dotenv.config();
  });

  it("Should return a string if a valid environment variable exists", () => {
    process.env.SAMPLE_VAR = "this_is_a_sample_variable";
    const actual = getEnvVar("SAMPLE_VAR");
    expect(actual).toBe("this_is_a_sample_variable");
  });

  it("Should throw an error if the environment variable does not exist", () => {
    const varName = "NON_EXISTENT_VAR";
    expect(() => getEnvVar(varName)).toThrow(
      `Environment variable ${varName} is not defined`
    );
  });
});
