import SystemStack from "@src/controllers/system-stack-controller";
import supabase from "@src/config/supabase-client";
import { getStatusMessage, Status } from "@src/utils/status-codes";

jest.mock("@src/config/supabase-client", () => ({
  __esModule: true,
  default: { from: jest.fn() },
}));

type SupabaseQuery = {
  select: jest.Mock;
  eq: jest.Mock;
  match: jest.Mock;
  not: jest.Mock;
  single: jest.Mock;
  order: jest.Mock;
  limit: jest.Mock;
};

const mockFrom = supabase.from as unknown as jest.Mock;

const createMockQuery = (): SupabaseQuery => {
  const query = {
    select: jest.fn(),
    eq: jest.fn(),
    match: jest.fn(),
    not: jest.fn(),
    single: jest.fn(),
    order: jest.fn(),
    limit: jest.fn(),
  } as unknown as SupabaseQuery;

  // Make all methods chainable
  query.select.mockReturnValue(query);
  query.eq.mockReturnValue(query);
  query.match.mockReturnValue(query);
  query.not.mockReturnValue(query);
  query.order.mockReturnValue(query);
  query.limit.mockReturnValue(query);

  return query;
};

const setSupabaseFrom = (tableName: string, query: SupabaseQuery) => {
  mockFrom.mockImplementation((tbl: string) => {
    if (tbl !== tableName) throw new Error(`Unexpected table name: ${tbl}`);
    return query;
  });
};

const mockRequest = (overrides: any = {}) =>
  ({ params: {}, body: {}, query: {}, ...overrides } as any);

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

beforeAll(() => jest.spyOn(console, "error").mockImplementation(() => {}));
afterAll(() => (console.error as jest.Mock).mockRestore());

describe("SystemStack controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFrom.mockReset();
  });

  // ---------------- GET SYSTEM STACK BY ID ----------------
  it("returns 200 with stack data when lookup succeeds", async () => {
    const req = mockRequest({ params: { id: "stack-1" } });
    const res = mockResponse();

    const query = createMockQuery();
    const stack = { id: "stack-1", substrate: "Concrete" };
    query.single.mockResolvedValue({ data: stack, error: null });
    setSupabaseFrom("system_stack", query);

    await SystemStack.getSystemStackById(req, res);

    expect(mockFrom).toHaveBeenCalledWith("system_stack");
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
    setSupabaseFrom("system_stack", query);

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
    setSupabaseFrom("system_stack", query);

    await SystemStack.getSystemStackById(req, res);

    expect(res.status).toHaveBeenCalledWith(Status.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      error: getStatusMessage(Status.INTERNAL_SERVER_ERROR),
    });
  });

  // ---------------- GET SELECTION OPTIONS ----------------
  describe("getSelectionOptions", () => {
    it("returns 200 with selection options", async () => {
      const req = mockRequest({
        query: { distributor: "Bayset", area_type: "roof" },
      });
      const res = mockResponse();

      const query = createMockQuery();
      query.match.mockReturnValue(query);
      query.not.mockResolvedValue({
        data: [{ substrate: "concrete" }],
        error: null,
      });

      setSupabaseFrom("system_stack", query);

      await SystemStack.getSelectionOptions(req, res);

      expect(mockFrom).toHaveBeenCalledWith("system_stack");
      expect(res.status).toHaveBeenCalledWith(Status.SUCCESS);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Selection options retrieved successfully",
          data: expect.any(Object),
        })
      );
    });

    it("returns 500 when Supabase throws", async () => {
      const req = mockRequest({ query: { distributor: "Bayset" } });
      const res = mockResponse();

      const query = createMockQuery();
      query.select.mockImplementation(() => {
        throw new Error("Supabase error");
      });

      setSupabaseFrom("system_stack", query);

      await SystemStack.getSelectionOptions(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Supabase error",
        })
      );
    });
  });

  // ---------------- GET SYSTEM STACK LAYERS ----------------
  describe("getSystemStackLayers", () => {
    it("returns 400 if ID param is missing", async () => {
      const req = mockRequest({ params: {} });
      const res = mockResponse();

      await SystemStack.getSystemStackLayers(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        error: "Missing system_stack_id parameter",
      });
    });

    it("returns 200 with layer combinations when found", async () => {
      const req = mockRequest({ params: { id: "1" } });
      const res = mockResponse();

      const query = createMockQuery();
      query.order.mockResolvedValue({
        data: [
          {
            system_stack_id: "1",
            combination: 1,
            product: { id: "p1", name: "Primer", layer: "Base" },
          },
        ],
        error: null,
      });

      setSupabaseFrom("system_stack_layer", query);

      await SystemStack.getSystemStackLayers(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.SUCCESS);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "System stack combinations retrieved successfully",
        })
      );
    });

    it("returns 404 when no layers exist", async () => {
      const req = mockRequest({ params: { id: "1" } });
      const res = mockResponse();

      const query = createMockQuery();
      query.order.mockResolvedValue({ data: [], error: null });

      setSupabaseFrom("system_stack_layer", query);

      await SystemStack.getSystemStackLayers(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "No layers found for this system stack",
        })
      );
    });

    it("returns 500 when query throws", async () => {
      const req = mockRequest({ params: { id: "1" } });
      const res = mockResponse();

      const query = createMockQuery();
      query.eq.mockImplementation(() => {
        throw new Error("Timeout");
      });

      setSupabaseFrom("system_stack_layer", query);

      await SystemStack.getSystemStackLayers(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Timeout",
        })
      );
    });
  });
});
