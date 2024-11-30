import { TwinClass_DETAILED } from "@/entities/twinClass";

const twinClassMap = {
  supplyPortion: {
    id: "5e8ff555-fda9-440e-9102-3d8f120ce532",
    key: "SUPPLY_PORTION",
    name: "Supply portion",
  } as TwinClass_DETAILED,
};

export const Fake = {
  TwinClass: twinClassMap.supplyPortion,
  TwinClassField: {
    id: "c2b35e49-a3a5-43da-8cb7-dfb7a0989303",
    key: "storage",
    name: "Storage",
    description: "Lorem ipsum dolor sit amet consectetur.",
    twinClassId: twinClassMap.supplyPortion.id,
  },
  TwinFlow: {
    id: "26d272e1-a899-47a7-b27c-d441b4b4cdd7",
    name: "Default supply portion twinflow",
    description: "Default supply portion twinflow",
    twinClassId: "5e8ff555-fda9-440e-9102-3d8f120ce532",
    twinClass: twinClassMap.supplyPortion,
  },
  TwinFlowTransition: {
    id: "627bb3f0-8d4b-4e20-847b-44500671d73c",
    name: "Task Transfer",
    alias: "supplyTaskTransfer",
    description: "Lorem ipsum dolor sit amet consectetur.",
    srcTwinStatusId: "2b71d52f-fa82-4f8c-b410-f6cf0c7a5ce9",
    srcTwinStatus: {
      backgroundColor: "#9EBFFF",
      description: "",
      id: "2b71d52f-fa82-4f8c-b410-f6cf0c7a5ce9",
      key: "inUse",
      name: "In use",
    },
    dstTwinStatusId: "2b71d52f-fa82-4f8c-b410-f6cf0c7a5ce9",
    dstTwinStatus: {
      backgroundColor: "#9EBFFF",
      description: "",
      id: "2b71d52f-fa82-4f8c-b410-f6cf0c7a5ce9",
      key: "inUse",
      name: "In use",
    },
    permissionId: "cdb95785-9415-45ce-8adf-f559e360005a",
    permission: {
      description: "",
      groupId: "cdb95785-9415-45ce-8adf-f559e360005a",
      id: "097a8885-a387-446c-995a-429bda632c4b",
      key: "SUPPLY_TASK_TRANSFER",
      name: "",
    },
    createdByUserId: "dfb5785a-16fd-4968-ab34-fec9f43f4672",
    createdByUser: {
      fullName: "Dmitri Dmitri",
    },
    createdAt: "2024-11-29T11:58:13",
    allowAttachments: true,
    allowComment: true,
    allowLinks: true,
  },
  UserGroup: {
    id: "e155e05b-f353-49ff-9869-da1e62aab179",
    name: "manager",
    type: "domainScopeBusinessAccountManage",
  },
  Comment: {
    id: "123",
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere, consequatur.",
    authorUserId: "608c6d7d-99c8-4d87-89c6-2f72d0f5d673",
    authorUser: {
      id: "608c6d7d-99c8-4d87-89c6-2f72d0f5d673",
      fullName: "John Doe",
      email: "userTest@buffergroup.com",
    },
    createdAt: "2024-11-18T08:27:04",
  },
};
