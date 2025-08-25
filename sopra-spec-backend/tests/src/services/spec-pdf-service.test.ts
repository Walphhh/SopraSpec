import { GenerateSpec } from "@src/services/spec-pdf-service";

describe("GenerateSpec", () => {
  it("should return a Buffer", async () => {
    const result = await GenerateSpec();
    expect(Buffer.isBuffer(result)).toBe(true);
  });

  it("should start with a valid PDF header", async () => {
    const result = await GenerateSpec();
    const header = result.slice(0, 4).toString();
    expect(header).toBe("%PDF");
  });

  it("should not be empty", async () => {
    const result = await GenerateSpec();
    expect(result.length).toBeGreaterThan(100); // arbitrary safety check
  });

  it("should end with '%%EOF'", async () => {
    const result = await GenerateSpec();
    const content = result.toString("utf8");
    expect(content.trim().endsWith("%%EOF")).toBe(true);
  });
});
