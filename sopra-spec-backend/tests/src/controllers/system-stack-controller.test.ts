import SystemStack from "@src/controllers/system-stack-controller";
import supabase from "@src/config/supabase-client";
import { getStatusMessage, Status } from "@src/utils/status-codes";

jest.mock("@src/config/supabase-client", () => {
  return {
    __esModule: true,
    default: {
      from: jest.fn(),
    },
  };
});

type SupabaseQuery = {
  select: jest.Mock;
  eq: jest.Mock;
  single: jest.Mock;
};

const mockFrom = supabase.from as unknown as jest.Mock;

const createMockQuery = (): SupabaseQuery => {
  const query = {
    select: jest.fn(),
    eq: jest.fn(),
    single: jest.fn(),
  } as SupabaseQuery;

  query.select.mockReturnValue(query);
  query.eq.mockReturnValue(query);

  return query;
};

const setSupabaseQuery = (query: SupabaseQuery) => {
  mockFrom.mockImplementation((table: string) => {
    if (table !== "system_stack") {
      throw new Error("Unexpected table: " + table);
    }
    return query;
  });
};

const mockRequest = (overrides: any = {}) =>
  ({
    params: {},
    ...overrides,
  } as any);

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("SystemStack controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFrom.mockReset();
  });

  it("returns 200 with stack data when lookup succeeds", async () => {
    const req = mockRequest({ params: { id: "stack-1" } });
    const res = mockResponse();

    const query = createMockQuery();
    const stack = { id: "stack-1", substrate: "Concrete" };
    query.single.mockResolvedValue({ data: stack, error: null });

    setSupabaseQuery(query);

    await SystemStack.getSystemStackById(req, res);

    expect(mockFrom).toHaveBeenCalledWith("system_stack");
    expect(query.select).toHaveBeenCalledTimes(1);
    expect((query.select as jest.Mock).mock.calls[0][0]).toContain("system_stack_layer");
    expect(query.eq).toHaveBeenCalledWith("id", "stack-1");
    expect(res.status).toHaveBeenCalledWith(Status.SUCCESS);
    expect(res.json).toHaveBeenCalledWith({
      message: "System stack retrieved successfully",
      data: stack,
    });
  });

  it("returns 400 when supabase reports an error", async () => {
    const req = mockRequest({ params: { id: "stack-1" } });
    const res = mockResponse();

    const query = createMockQuery();
    query.single.mockResolvedValue({
      data: null,
      error: { message: "Lookup failed" },
    });

    setSupabaseQuery(query);

    await SystemStack.getSystemStackById(req, res);

    expect(res.status).toHaveBeenCalledWith(Status.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({ error: "Lookup failed" });
  });

  it("returns 500 when the lookup throws", async () => {
    const req = mockRequest({ params: { id: "stack-1" } });
    const res = mockResponse();

    const query = createMockQuery();
    query.eq.mockImplementation(() => {
      throw new Error("Timeout");
    });

    setSupabaseQuery(query);

    await SystemStack.getSystemStackById(req, res);

    expect(res.status).toHaveBeenCalledWith(Status.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      error: getStatusMessage(Status.INTERNAL_SERVER_ERROR),
    });
  });
});
