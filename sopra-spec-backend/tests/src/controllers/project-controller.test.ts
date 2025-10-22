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

type SupabaseQuery = {
  insert: jest.Mock;
  select: jest.Mock;
  delete: jest.Mock;
  eq: jest.Mock;
  single: jest.Mock;
};

const mockFrom = supabase.from as unknown as jest.Mock;

const createMockQuery = (): SupabaseQuery => {
  const query = {
    insert: jest.fn(),
    select: jest.fn(),
    delete: jest.fn(),
    eq: jest.fn(),
    single: jest.fn(),
  } as SupabaseQuery;

  query.insert.mockReturnValue(query);
  query.select.mockReturnValue(query);
  query.delete.mockReturnValue(query);
  query.eq.mockReturnValue(query);

  return query;
};

const setSupabaseFrom = (mapping: Record<string, SupabaseQuery>) => {
  mockFrom.mockImplementation((table: string) => {
    const query = mapping[table];
    if (!query) {
      throw new Error("Unexpected table: " + table);
    }
    return query;
  });
};

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

describe("ProjectController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFrom.mockReset();
  });

  describe("createProject", () => {
    it("returns 200 with project payload when insert succeeds", async () => {
      const req = mockRequest({
        body: {
          ownerId: "owner-1",
          name: "My Project",
          description: "Description",
        },
      });
      const res = mockResponse();

      const projectQuery = createMockQuery();
      const createdProject = { id: "project-1", name: "My Project" };
      projectQuery.single.mockResolvedValue({ data: createdProject, error: null });

      setSupabaseFrom({ projects: projectQuery });

      await ProjectController.createProject(req, res);

      expect(mockFrom).toHaveBeenCalledWith("projects");
      expect(projectQuery.insert).toHaveBeenCalledWith([
        { owner_id: "owner-1", name: "My Project", description: "Description" },
      ]);
      expect(projectQuery.select).toHaveBeenCalledTimes(1);
      expect(projectQuery.single).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(Status.SUCCESS);
      expect(res.json).toHaveBeenCalledWith({ project: createdProject });
    });

    it("returns 400 when supabase returns an error during insert", async () => {
      const req = mockRequest({
        body: { ownerId: "owner-1", name: "Fails" },
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
      const req = mockRequest({
        body: { ownerId: "owner-1", name: "Throws" },
      });
      const res = mockResponse();

      const projectQuery = createMockQuery();
      projectQuery.insert.mockImplementation(() => {
        throw new Error("Unexpected failure");
      });

      setSupabaseFrom({ projects: projectQuery });

      await ProjectController.createProject(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        error: getStatusMessage(Status.INTERNAL_SERVER_ERROR),
      });
    });
  });

  describe("getProjectsByOwner", () => {
    it("returns 400 when ownerId is missing", async () => {
      const req = mockRequest({ query: {} });
      const res = mockResponse();

      await ProjectController.getProjectsByOwner(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ error: "Missing ownerId" });
      expect(mockFrom).not.toHaveBeenCalled();
    });

    it("returns 200 with projects when query succeeds", async () => {
      const req = mockRequest({ query: { ownerId: "owner-1" } });
      const res = mockResponse();

      const projectQuery = createMockQuery();
      const projects = [{ id: "project-1" }, { id: "project-2" }];
      projectQuery.eq.mockImplementation(() =>
        Promise.resolve({ data: projects, error: null })
      );

      setSupabaseFrom({ projects: projectQuery });

      await ProjectController.getProjectsByOwner(req, res);

      expect(projectQuery.select).toHaveBeenCalledWith("*");
      expect(projectQuery.eq).toHaveBeenCalledWith("owner_id", "owner-1");
      expect(res.status).toHaveBeenCalledWith(Status.SUCCESS);
      expect(res.json).toHaveBeenCalledWith({ projects });
    });

    it("returns 400 when supabase responds with an error", async () => {
      const req = mockRequest({ query: { ownerId: "owner-1" } });
      const res = mockResponse();

      const projectQuery = createMockQuery();
      projectQuery.eq.mockImplementation(() =>
        Promise.resolve({
          data: null,
          error: { message: "Query failed" },
        })
      );

      setSupabaseFrom({ projects: projectQuery });

      await ProjectController.getProjectsByOwner(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ error: "Query failed" });
    });

    it("returns 500 when the query throws", async () => {
      const req = mockRequest({ query: { ownerId: "owner-1" } });
      const res = mockResponse();

      const projectQuery = createMockQuery();
      projectQuery.eq.mockImplementation(() => {
        throw new Error("Database offline");
      });

      setSupabaseFrom({ projects: projectQuery });

      await ProjectController.getProjectsByOwner(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        error: getStatusMessage(Status.INTERNAL_SERVER_ERROR),
      });
    });
  });

  describe("getProjectById", () => {
    it("returns 200 with project when found", async () => {
      const req = mockRequest({ params: { id: "project-1" } });
      const res = mockResponse();

      const projectQuery = createMockQuery();
      const project = { id: "project-1", project_areas: [] };
      projectQuery.eq.mockReturnValue(projectQuery);
      projectQuery.single.mockResolvedValue({ data: project, error: null });

      setSupabaseFrom({ projects: projectQuery });

      await ProjectController.getProjectById(req, res);

      expect(projectQuery.select).toHaveBeenCalledTimes(1);
      expect(projectQuery.eq).toHaveBeenCalledWith("id", "project-1");
      expect(projectQuery.single).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(Status.SUCCESS);
      expect(res.json).toHaveBeenCalledWith({ project });
    });

    it("returns 400 when supabase returns an error", async () => {
      const req = mockRequest({ params: { id: "project-1" } });
      const res = mockResponse();

      const projectQuery = createMockQuery();
      projectQuery.eq.mockReturnValue(projectQuery);
      projectQuery.single.mockResolvedValue({
        data: null,
        error: { message: "Not found" },
      });

      setSupabaseFrom({ projects: projectQuery });

      await ProjectController.getProjectById(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ error: "Not found" });
    });

    it("returns 500 when the lookup throws", async () => {
      const req = mockRequest({ params: { id: "project-1" } });
      const res = mockResponse();

      const projectQuery = createMockQuery();
      projectQuery.eq.mockImplementation(() => {
        throw new Error("Timeout");
      });

      setSupabaseFrom({ projects: projectQuery });

      await ProjectController.getProjectById(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        error: getStatusMessage(Status.INTERNAL_SERVER_ERROR),
      });
    });
  });

  describe("deleteProject", () => {
    it("returns 200 when project is deleted", async () => {
      const req = mockRequest({ params: { id: "project-1" } });
      const res = mockResponse();

      const projectQuery = createMockQuery();
      projectQuery.delete.mockReturnValue(projectQuery);
      projectQuery.eq.mockImplementation(() => Promise.resolve({ error: null }));

      setSupabaseFrom({ projects: projectQuery });

      await ProjectController.deleteProject(req, res);

      expect(projectQuery.delete).toHaveBeenCalledTimes(1);
      expect(projectQuery.eq).toHaveBeenCalledWith("id", "project-1");
      expect(res.status).toHaveBeenCalledWith(Status.SUCCESS);
      expect(res.json).toHaveBeenCalledWith({
        message: "Project deleted successfully",
      });
    });

    it("returns 400 when supabase reports a delete error", async () => {
      const req = mockRequest({ params: { id: "project-1" } });
      const res = mockResponse();

      const projectQuery = createMockQuery();
      projectQuery.delete.mockReturnValue(projectQuery);
      projectQuery.eq.mockImplementation(() =>
        Promise.resolve({
          error: { message: "Delete failed" },
        })
      );

      setSupabaseFrom({ projects: projectQuery });

      await ProjectController.deleteProject(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ error: "Delete failed" });
    });

    it("returns 500 when delete throws", async () => {
      const req = mockRequest({ params: { id: "project-1" } });
      const res = mockResponse();

      const projectQuery = createMockQuery();
      projectQuery.delete.mockImplementation(() => {
        throw new Error("Unexpected failure");
      });

      setSupabaseFrom({ projects: projectQuery });

      await ProjectController.deleteProject(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        error: getStatusMessage(Status.INTERNAL_SERVER_ERROR),
      });
    });
  });

  describe("createProjectArea", () => {
    it("returns 200 with created project area", async () => {
      const req = mockRequest({
        params: { projectId: "project-1" },
        body: {
          name: "Roof",
          areaType: "Roof",
          drawing: "http://example.com/drawing",
          systemStackId: "stack-1",
          status: "active",
        },
      });
      const res = mockResponse();

      const areaQuery = createMockQuery();
      const area = { id: "area-1", name: "Roof" };
      areaQuery.single.mockResolvedValue({ data: area, error: null });

      setSupabaseFrom({ project_areas: areaQuery });

      await ProjectController.createProjectArea(req, res);

      expect(areaQuery.insert).toHaveBeenCalledWith([
        {
          project_id: "project-1",
          name: "Roof",
          area_type: "Roof",
          drawing: "http://example.com/drawing",
          system_stack_id: "stack-1",
          status: "active",
        },
      ]);
      expect(res.status).toHaveBeenCalledWith(Status.SUCCESS);
      expect(res.json).toHaveBeenCalledWith({ project_area: area });
    });

    it("returns 400 when supabase reports an insert error", async () => {
      const req = mockRequest({
        params: { projectId: "project-1" },
        body: {
          name: "Roof",
          areaType: "Roof",
        },
      });
      const res = mockResponse();

      const areaQuery = createMockQuery();
      areaQuery.single.mockResolvedValue({
        data: null,
        error: { message: "Area insert failed" },
      });

      setSupabaseFrom({ project_areas: areaQuery });

      await ProjectController.createProjectArea(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ error: "Area insert failed" });
    });

    it("returns 500 when insert throws", async () => {
      const req = mockRequest({
        params: { projectId: "project-1" },
        body: { name: "Roof" },
      });
      const res = mockResponse();

      const areaQuery = createMockQuery();
      areaQuery.insert.mockImplementation(() => {
        throw new Error("Insert throw");
      });

      setSupabaseFrom({ project_areas: areaQuery });

      await ProjectController.createProjectArea(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        error: getStatusMessage(Status.INTERNAL_SERVER_ERROR),
      });
    });
  });

  describe("getProjectAreas", () => {
    it("returns 200 with project areas when query succeeds", async () => {
      const req = mockRequest({ params: { projectId: "project-1" } });
      const res = mockResponse();

      const areaQuery = createMockQuery();
      const areas = [
        { id: "area-1", name: "Roof" },
        { id: "area-2", name: "Walls" },
      ];
      areaQuery.eq.mockImplementation(() =>
        Promise.resolve({ data: areas, error: null })
      );

      setSupabaseFrom({ project_areas: areaQuery });

      await ProjectController.getProjectAreas(req, res);

      expect(areaQuery.select).toHaveBeenCalledWith("*");
      expect(areaQuery.eq).toHaveBeenCalledWith("project_id", "project-1");
      expect(res.status).toHaveBeenCalledWith(Status.SUCCESS);
      expect(res.json).toHaveBeenCalledWith({ project_areas: areas });
    });

    it("returns 400 when supabase returns an error", async () => {
      const req = mockRequest({ params: { projectId: "project-1" } });
      const res = mockResponse();

      const areaQuery = createMockQuery();
      areaQuery.eq.mockImplementation(() =>
        Promise.resolve({
          data: null,
          error: { message: "Area query failed" },
        })
      );

      setSupabaseFrom({ project_areas: areaQuery });

      await ProjectController.getProjectAreas(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ error: "Area query failed" });
    });

    it("returns 500 when the query throws", async () => {
      const req = mockRequest({ params: { projectId: "project-1" } });
      const res = mockResponse();

      const areaQuery = createMockQuery();
      areaQuery.eq.mockImplementation(() => {
        throw new Error("Area query threw");
      });

      setSupabaseFrom({ project_areas: areaQuery });

      await ProjectController.getProjectAreas(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        error: getStatusMessage(Status.INTERNAL_SERVER_ERROR),
      });
    });
  });
});
