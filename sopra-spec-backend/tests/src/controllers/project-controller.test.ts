import ProjectController from "@src/controllers/project-controller";
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

// --- Supabase Mock Types ---
type SupabaseQuery = {
  insert: jest.Mock;
  select: jest.Mock;
  delete: jest.Mock;
  eq: jest.Mock;
  single: jest.Mock;
  order?: jest.Mock;
  limit?: jest.Mock;
};

// --- Base Mock Config ---
const mockFrom = supabase.from as unknown as jest.Mock;

// Utility to create a full Supabase-like query chain
const createMockQuery = (): SupabaseQuery => {
  const query: SupabaseQuery = {
    insert: jest.fn(),
    select: jest.fn(),
    delete: jest.fn(),
    eq: jest.fn(),
    single: jest.fn(),
    order: jest.fn(),
    limit: jest.fn(),
  };

  // Each method should return itself for chainability
  query.insert.mockReturnValue(query);
  query.select.mockReturnValue(query);
  query.delete.mockReturnValue(query);
  query.eq.mockReturnValue(query);
  query.order?.mockReturnValue(query);
  query.limit?.mockReturnValue(query);

  return query;
};

// --- Helper for mapping tables to mocks ---
const setSupabaseFrom = (mapping: Record<string, SupabaseQuery>) => {
  mockFrom.mockImplementation((table: string) => {
    const query = mapping[table];
    if (!query) throw new Error("Unexpected table: " + table);
    return query;
  });
};

// --- Mock Request/Response Factories ---
const mockRequest = (overrides: any = {}) =>
  ({
    body: {},
    params: {},
    query: {},
    ...overrides,
  } as any);

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// --- Silence Console Errors During Tests ---
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

describe("ProjectController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFrom.mockReset();
  });

  // --- Create Project ---
  describe("createProject", () => {
    it("returns 200 with project payload when insert succeeds", async () => {
      const req = mockRequest({
        body: { ownerId: "owner-1", name: "My Project" },
      });
      const res = mockResponse();

      const projectQuery = createMockQuery();
      const createdProject = { id: "project-1", name: "My Project" };
      projectQuery.single.mockResolvedValue({
        data: createdProject,
        error: null,
      });

      setSupabaseFrom({ projects: projectQuery });

      await ProjectController.createProject(req, res);

      expect(mockFrom).toHaveBeenCalledWith("projects");
      expect(projectQuery.insert).toHaveBeenCalledWith([
        { owner_id: "owner-1", name: "My Project" },
      ]);
      expect(res.status).toHaveBeenCalledWith(Status.SUCCESS);
      expect(res.json).toHaveBeenCalledWith({ project: createdProject });
    });

    it("returns 400 when supabase returns an error", async () => {
      const req = mockRequest({
        body: { ownerId: "owner-1", name: "ErrorProj" },
      });
      const res = mockResponse();

      const projectQuery = createMockQuery();
      projectQuery.single.mockResolvedValue({
        data: null,
        error: { message: "Insert failed" },
      });

      setSupabaseFrom({ projects: projectQuery });

      await ProjectController.createProject(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ error: "Insert failed" });
    });

    it("returns 500 when insert throws", async () => {
      const req = mockRequest({ body: { ownerId: "owner-1" } });
      const res = mockResponse();

      const projectQuery = createMockQuery();
      projectQuery.insert.mockImplementation(() => {
        throw new Error("Insert crash");
      });

      setSupabaseFrom({ projects: projectQuery });

      await ProjectController.createProject(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        error: getStatusMessage(Status.INTERNAL_SERVER_ERROR),
      });
    });
  });

  // --- Get Projects by Owner ---
  describe("getProjectsByOwner", () => {
    it("returns 400 when ownerId is missing", async () => {
      const req = mockRequest();
      const res = mockResponse();

      await ProjectController.getProjectsByOwner(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ error: "Missing ownerId" });
    });

    it("returns 200 with projects when query succeeds", async () => {
      const req = mockRequest({ query: { ownerId: "user-1" } });
      const res = mockResponse();

      const projectQuery = createMockQuery();
      const projects = [{ id: "p1" }, { id: "p2" }];
      projectQuery.eq.mockImplementation(() =>
        Promise.resolve({ data: projects, error: null })
      );

      setSupabaseFrom({ projects: projectQuery });

      await ProjectController.getProjectsByOwner(req, res);

      expect(projectQuery.eq).toHaveBeenCalledWith("owner_id", "user-1");
      expect(res.status).toHaveBeenCalledWith(Status.SUCCESS);
      expect(res.json).toHaveBeenCalledWith({ projects });
    });
  });

  // --- Get Project by ID ---
  describe("getProjectById", () => {
    it("returns 200 with project data", async () => {
      const req = mockRequest({ params: { id: "project-1" } });
      const res = mockResponse();

      const projectQuery = createMockQuery();
      const project = { id: "project-1", name: "Demo" };
      projectQuery.single.mockResolvedValue({ data: project, error: null });

      setSupabaseFrom({ projects: projectQuery });

      await ProjectController.getProjectById(req, res);

      expect(projectQuery.eq).toHaveBeenCalledWith("id", "project-1");
      expect(res.status).toHaveBeenCalledWith(Status.SUCCESS);
      expect(res.json).toHaveBeenCalledWith({ project });
    });
  });

  // --- Delete Project ---
  describe("deleteProject", () => {
    it("returns 200 when project is deleted", async () => {
      const req = mockRequest({ params: { id: "project-1" } });
      const res = mockResponse();

      const projectQuery = createMockQuery();
      projectQuery.eq.mockImplementation(() =>
        Promise.resolve({ error: null })
      );

      setSupabaseFrom({ projects: projectQuery });

      await ProjectController.deleteProject(req, res);

      expect(projectQuery.delete).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(Status.SUCCESS);
      expect(res.json).toHaveBeenCalledWith({
        message: "Project deleted successfully",
      });
    });
  });

  // --- Create Project Area ---
  describe("createProjectArea", () => {
    it("returns 200 when project area is created", async () => {
      const req = mockRequest({
        params: { projectId: "project-1" },
        body: { name: "Roof", areaType: "roof" },
      });
      const res = mockResponse();

      const areaQuery = createMockQuery();
      const area = { id: "area-1", name: "Roof" };
      areaQuery.single.mockResolvedValue({ data: area, error: null });

      setSupabaseFrom({ project_areas: areaQuery });

      await ProjectController.createProjectArea(req, res);

      expect(areaQuery.insert).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(Status.SUCCESS);
      expect(res.json).toHaveBeenCalledWith({ project_area: area });
    });
  });

  // --- Get Project Areas ---
  describe("getProjectAreas", () => {
    it("returns 200 with project areas", async () => {
      const req = mockRequest({ params: { projectId: "project-1" } });
      const res = mockResponse();

      const areaQuery = createMockQuery();
      const areas = [{ id: "a1" }, { id: "a2" }];
      areaQuery.eq.mockImplementation(() =>
        Promise.resolve({ data: areas, error: null })
      );

      setSupabaseFrom({ project_areas: areaQuery });

      await ProjectController.getProjectAreas(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.SUCCESS);
      expect(res.json).toHaveBeenCalledWith({ project_areas: areas });
    });
  });
});
