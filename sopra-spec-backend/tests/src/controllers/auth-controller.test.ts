import Auth from "@src/controllers/auth-controller";
import supabase from "@src/config/supabase-client"; // this will be mocked

jest.mock("@src/config/supabase-client", () => ({
  __esModule: true, // if supabase-client is an ES module
  default: {
    auth: {
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

// helper mocks for req/res
const mockRequest = (body = {}) => ({ body } as any);
const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Auth controller with inline mock", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 on successful login", async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: { id: "123" } }, // I actually don't know what the return value's structure looks like 💀
      error: null,
    });

    const req = mockRequest({ email: "test@example.com", password: "test" });
    const res = mockResponse();

    await Auth.signInWithPassword(req, res);

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "test",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Login successful" });
  });
});
