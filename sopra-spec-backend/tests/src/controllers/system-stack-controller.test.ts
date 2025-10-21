import SystemStack from "@src/controllers/system-stack-controller";
import supabase from "@src/config/supabase-client";
import { getStatusMessage, Status } from "@src/utils/status-codes";

// Mock supabase
jest.mock("@src/config/supabase-client", () => {
  const mockFrom = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    not: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
  };

  return {
    __esModule: true,
    default: {
      from: jest.fn(() => mockFrom),
    },
  };
});

// Helper mocks for req/res
const mockRequest = (params = {}, body = {}) => ({ params, body } as any);
const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("SystemStack Controller Test Suite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getSystemStackById", () => {
    it("Should return status 200 on successful retrieval", async () => {
      const mockSystemStack = {
        id: "1",
        substrate: "concrete",
        insulated: true,
        exposure: false,
        material: "bitumen",
        attachment: "mechanically_fixed",
        system_stack_layer: [
          {
            product: {
              name: "Test Product",
              layer: "membrane",
              distributor: {
                distributor_name: "Test Distributor"
              }
            }
          }
        ]
      };

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockSystemStack,
          error: null
        })
      });

      const req = mockRequest({ id: "1" });
      const res = mockResponse();

      await SystemStack.getSystemStackById(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.SUCCESS);
      expect(res.json).toHaveBeenCalledWith({
        message: "System stack retrieved successfully",
        data: mockSystemStack,
      });
    });

    it("Should return status 400 if supabase returns an error", async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: "System stack not found" }
        })
      });

      const req = mockRequest({ id: "999" });
      const res = mockResponse();

      await SystemStack.getSystemStackById(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        error: "System stack not found"
      });
    });

    it("Should return status 500 if an exception is thrown", async () => {
      (supabase.from as jest.Mock).mockImplementation(() => {
        throw new Error("Database connection failed");
      });

      const req = mockRequest({ id: "1" });
      const res = mockResponse();

      await SystemStack.getSystemStackById(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        error: getStatusMessage(Status.INTERNAL_SERVER_ERROR)
      });
    });
  });

  describe("getRecommendedSystems", () => {
    it("Should return status 200 with recommended systems", async () => {
      const mockSelections = {
        substrate: "concrete",
        material: "bitumen",
        insulated: true,
        exposure: false,
        attachment: "mechanically_fixed"
      };

      const mockRecommendedSystems = [
        {
          id: "1",
          substrate: "concrete",
          insulated: true,
          exposure: false,
          material: "bitumen",
          attachment: "mechanically_fixed",
          system_stack_layer: [
            {
              priority: 1,
              product: {
                id: "prod1",
                name: "Test Product",
                layer: "membrane",
                distributor_id: "dist1",
                distributor: {
                  id: "dist1",
                  distributor_name: "Test Distributor"
                }
              }
            }
          ]
        }
      ];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        data: mockRecommendedSystems,
        error: null
      };
      
      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const req = mockRequest({}, {
        user_id: "user123",
        selections: mockSelections
      });
      const res = mockResponse();

      await SystemStack.getRecommendedSystems(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.SUCCESS);
      expect(res.json).toHaveBeenCalledWith({
        message: "System recommendations generated successfully",
        data: {
          selections: mockSelections,
          recommendedSystems: mockRecommendedSystems,
          count: 1
        }
      });
    });

    it("Should return status 400 if user_id is missing", async () => {
      const req = mockRequest({}, { 
        selections: { substrate: "concrete" } 
      });
      const res = mockResponse();

      await SystemStack.getRecommendedSystems(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        error: "User ID and selections are required"
      });
    });

    it("Should return status 400 if selections are missing", async () => {
      const req = mockRequest({}, { 
        user_id: "user123" 
      });
      const res = mockResponse();

      await SystemStack.getRecommendedSystems(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        error: "User ID and selections are required"
      });
    });

    it("Should return status 404 if no recommended systems found", async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        data: [],
        error: null
      };
      
      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const mockSelections = { substrate: "unknown" };
      const req = mockRequest({}, {
        user_id: "user123",
        selections: mockSelections
      });
      const res = mockResponse();

      await SystemStack.getRecommendedSystems(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        message: "No recommended systems found for the given selections",
        data: {
          selections: mockSelections,
          recommendedSystems: [],
          count: 0
        }
      });
    });

    it("Should return status 400 if supabase returns an error", async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        data: null,
        error: { message: "Database query failed" }
      };
      
      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const req = mockRequest({}, {
        user_id: "user123",
        selections: { substrate: "concrete" }
      });
      const res = mockResponse();

      await SystemStack.getRecommendedSystems(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        error: "Database query failed"
      });
    });

    it("Should return status 500 if an exception is thrown", async () => {
      (supabase.from as jest.Mock).mockImplementation(() => {
        throw new Error("Database connection failed");
      });

      const req = mockRequest({}, { 
        user_id: "user123", 
        selections: { substrate: "concrete" } 
      });
      const res = mockResponse();

      await SystemStack.getRecommendedSystems(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        error: getStatusMessage(Status.INTERNAL_SERVER_ERROR)
      });
    });
  });

  describe("getSelectionOptions", () => {
    it("Should return status 200 with selection options", async () => {
      const mockData = [
        { substrate: "concrete", material: "bitumen", attachment: "mechanically_fixed" },
        { substrate: "timber", material: "synthetic", attachment: "self_adhered" },
        { substrate: "concrete", material: "synthetic", attachment: "mechanically_fixed" }
      ];

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        not: jest.fn().mockReturnThis(),
        data: mockData,
        error: null
      });

      const req = mockRequest();
      const res = mockResponse();

      await SystemStack.getSelectionOptions(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.SUCCESS);
      expect(res.json).toHaveBeenCalledWith({
        message: "Selection options retrieved successfully",
        data: {
          steps: {
            substrate: {
              title: "What type of substrate?",
              options: [
                { value: "concrete", label: "Concrete" },
                { value: "timber", label: "Timber" }
              ]
            },
            material: {
              title: "What material type?",
              options: [
                { value: "bitumen", label: "Bitumen" },
                { value: "synthetic", label: "Synthetic" }
              ]
            },
            insulated: {
              title: "Do you need insulation?",
              options: [
                { value: true, label: "Yes, insulated" },
                { value: false, label: "No, non-insulated" }
              ]
            },
            exposure: {
              title: "Will it be exposed?",
              options: [
                { value: true, label: "Yes, exposed" },
                { value: false, label: "No, protected" }
              ]
            },
            attachment: {
              title: "What attachment method?",
              options: [
                { value: "mechanically_fixed", label: "Mechanically fixed" },
                { value: "self_adhered", label: "Self adhered" }
              ]
            }
          }
        }
      });
    });

    it("Should return status 400 if supabase returns an error", async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        not: jest.fn().mockReturnThis(),
        data: null,
        error: { message: "Failed to fetch selection options" }
      });

      const req = mockRequest();
      const res = mockResponse();

      await SystemStack.getSelectionOptions(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to fetch selection options"
      });
    });

    it("Should return status 500 if an exception is thrown", async () => {
      (supabase.from as jest.Mock).mockImplementation(() => {
        throw new Error("Database connection failed");
      });

      const req = mockRequest();
      const res = mockResponse();

      await SystemStack.getSelectionOptions(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        error: getStatusMessage(Status.INTERNAL_SERVER_ERROR)
      });
    });

    it("Should handle empty data gracefully", async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        not: jest.fn().mockReturnThis(),
        data: [],
        error: null
      });

      const req = mockRequest();
      const res = mockResponse();

      await SystemStack.getSelectionOptions(req, res);

      expect(res.status).toHaveBeenCalledWith(Status.SUCCESS);
      expect(res.json).toHaveBeenCalledWith({
        message: "Selection options retrieved successfully",
        data: {
          steps: {
            substrate: {
              title: "What type of substrate?",
              options: []
            },
            material: {
              title: "What material type?",
              options: []
            },
            insulated: {
              title: "Do you need insulation?",
              options: [
                { value: true, label: "Yes, insulated" },
                { value: false, label: "No, non-insulated" }
              ]
            },
            exposure: {
              title: "Will it be exposed?",
              options: [
                { value: true, label: "Yes, exposed" },
                { value: false, label: "No, protected" }
              ]
            },
            attachment: {
              title: "What attachment method?",
              options: []
            }
          }
        }
      });
    });
  });
});