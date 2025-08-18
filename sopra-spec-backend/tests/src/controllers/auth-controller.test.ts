import Auth from "@src/controllers/auth-controller";
import supabase from "@src/config/supabase-client"; // this will be mocked
import { getStatusMessage, Status } from "@src/utils/status-codes";

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

describe("Sign In with Password test suite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should return status 200 on successful login", async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: { id: "123" } }, // I actually don't know what the return value's structure looks like 💀
      error: null,
    });

    const req = mockRequest({ email: "test@example.com", password: "test" });
    const res = mockResponse();

    await Auth.signInWithPassword(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "test",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Login successful" });
  });

  it("Should return status 400 if email is missing", async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: { id: "123" } }, // I actually don't know what the return value's structure looks like 💀
      error: null,
    });

    const req = mockRequest({ email: "", password: "test" });
    const res = mockResponse();

    await Auth.signInWithPassword(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(Status.BAD_REQUEST);
  });

  it("Should return status 400 if password is missing", async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: { id: "123" } }, // I actually don't know what the return value's structure looks like 💀
      error: null,
    });

    const req = mockRequest({ email: "test@mail.com", password: "" });
    const res = mockResponse();

    await Auth.signInWithPassword(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(Status.BAD_REQUEST);
  });

  it("Should return status 400 if an error occurs", async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: { id: "123" } }, // I actually don't know what the return value's structure looks like 💀
      error: true,
    });

    const req = mockRequest({ email: "test@mail.com", password: "test" });
    const res = mockResponse();

    await Auth.signInWithPassword(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(Status.BAD_REQUEST);
  });

  it("Should return status 500 if it throws an error", async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockImplementation(() => {
      throw new Error("Unexpected error");
    });

    const req = mockRequest({ email: "test@mail.com", password: "test" });
    const res = mockResponse();

    await Auth.signInWithPassword(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(Status.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      error: getStatusMessage(Status.INTERNAL_SERVER_ERROR),
    });
  });
});

describe("Logout Test suite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return status 200 on successful logout", async () => {
    (supabase.auth.signOut as jest.Mock).mockResolvedValue({
      error: null,
    });
    const req = mockRequest();
    const res = mockResponse();

    await Auth.logout(req, res);

    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Logout successful" });
  });

  it("should return status 500 if it throws an error", async () => {
    (supabase.auth.signOut as jest.Mock).mockImplementation(() => {
      throw new Error("Unexpected error");
    });
    const req = mockRequest();
    const res = mockResponse();

    await Auth.logout(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(Status.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      error: getStatusMessage(Status.INTERNAL_SERVER_ERROR),
    });
  });
});
