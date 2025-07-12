import { TwinClass_DETAILED } from "@/entities/twin-class";
import { TwinClassField } from "@/entities/twin-class-field";

const twinClassMap = {
  supplyPortion: {
    id: "5e8ff555-fda9-440e-9102-3d8f120ce532",
    key: "SUPPLY_PORTION",
    name: "Supply portion",
  } as TwinClass_DETAILED,
};

export const Fake = {
  loremIpsum: {
    id: "lorem-ipsum",
    key: "Lorem ipsum",
    name: "Lorem ipsum",
    fullName: "Lorem Ipsum",
    alias: "lorem ipsum",
    description: "Lorem ipsum dolor sit amet consectetur.",
  } as any,
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
  TwinFlowSchema: {
    id: "2c618b09-e8dc-4712-a433-2e18915ee70d",
    name: "TwinFlowSchema name",
    description: "Lorem ipsum dolor sit amet consectetur.",
    domainId: "f67ad556-dd27-4871-9a00-16fb0e8a4102",
    createdByUserId: "608c6d7d-99c8-4d87-89c6-2f72d0f5d673",
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
  Featurer: {
    id: 1301,
    featurerTypeId: 13,
    name: "FieldTyperTextField",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere, consequatur.",
    deprecated: false,
    params: [
      {
        key: "regexp",
        name: "regexp",
        description: "",
        type: "STRING",
      },
    ],
  },

  // Twin fields
  FieldInputs: {
    textV1: {
      id: "15b1c55a-d030-445f-8f88-709c86478ec9",
      key: "note",
      name: "Notes",
      description: "",
      required: false,
      descriptor: {
        fieldType: "textV1",
        regExp: ".*",
      } as NonNullable<TwinClassField["descriptor"]>,
      value: "",
    },
    urlV1: {
      id: "15b1c55a-d030-445f-8f88-709c86478ec9",
      key: "domain",
      name: "Domain",
      description: "",
      required: false,
      descriptor: { fieldType: "urlV1" } as NonNullable<
        TwinClassField["descriptor"]
      >,
      value: "",
    },
    numericFieldV1: {
      id: "f1608946-ccba-4ab2-a2c9-bbe96b2ad759",
      key: "quantity",
      name: "Quantity",
      description: "",
      required: false,
      descriptor: {
        fieldType: "numericFieldV1",
        min: 0,
        max: 100,
        step: 1,
        thousandSeparator: ",",
        decimalSeparator: ".",
        decimalPlaces: 1,
      } as NonNullable<TwinClassField["descriptor"]>,
      value: 0,
    },

    colorHexV1: {
      id: "foobar",
      key: "key",
      name: "Key",
      description: "",
      required: false,
      descriptor: { fieldType: "colorHexV1" } as NonNullable<
        TwinClassField["descriptor"]
      >,
      value: "#BCFFA5",
    },
    dateScrollV1: {
      id: "foobar",
      key: "dateScroll",
      name: "Date scroll",
      description: "",
      required: false,
      descriptor: {
        fieldType: "dateScrollV1",
        pattern: "",
      } as NonNullable<TwinClassField["descriptor"]>,
      value: undefined,
    },
    immutableV1: {
      id: "foobar",
      key: "immutable",
      name: "Immutable",
      description: "",
      required: false,
      descriptor: { fieldType: "immutableV1" } as NonNullable<
        TwinClassField["descriptor"]
      >,
      value: "Some immutable value",
    },
    attachmentFieldV1: {
      id: "foobar",
      key: "key",
      name: "Key",
      description: "",
      required: false,
      descriptor: { fieldType: "attachmentFieldV1" } as NonNullable<
        TwinClassField["descriptor"]
      >,
      value: "",
    },
    selectListV1: {
      id: "34368bc2-c052-4af9-9f50-4410baad797a",
      key: "priceCurrency",
      name: "Price currency",
      description: "",
      required: false,
      descriptor: {
        fieldType: "selectListV1",
        multiple: false,
        options: [],
        supportCustom: false,
      } as NonNullable<TwinClassField["descriptor"]>,
      value: "",
    },
    selectLongV1: {
      id: "foobar",
      key: "key",
      name: "Key",
      description: "",
      required: false,
      descriptor: { fieldType: "selectLongV1" } as NonNullable<
        TwinClassField["descriptor"]
      >,
      value: "",
    },
    selectLinkV1: {
      id: "foobar",
      key: "key",
      name: "Key",
      description: "",
      required: false,
      descriptor: { fieldType: "selectLinkV1" } as NonNullable<
        TwinClassField["descriptor"]
      >,
      value: "",
    },
    selectLinkLongV1: {
      id: "",
      key: "",
      name: "",
      description: "",
      required: false,
      descriptor: {
        fieldType: "selectLinkLongV1",
        linkId: "6e42ef74-3015-4400-946e-1326bcb4cf48",
        multiple: false,
      } as NonNullable<TwinClassField["descriptor"]>,
      value: "",
    },
    selectSharedInHeadV1: {
      id: "foobar",
      key: "key",
      name: "Key",
      description: "",
      required: false,
      descriptor: { fieldType: "selectSharedInHeadV1" } as NonNullable<
        TwinClassField["descriptor"]
      >,
      value: "",
    },
    selectUserV1: {
      id: "foobar",
      key: "key",
      name: "Key",
      description: "",
      required: false,
      descriptor: { fieldType: "selectUserV1" } as NonNullable<
        TwinClassField["descriptor"]
      >,
      value: "",
    },
    selectUserLongV1: {
      id: "foobar",
      key: "key",
      name: "Key",
      description: "",
      required: false,
      descriptor: { fieldType: "selectUserLongV1" } as NonNullable<
        TwinClassField["descriptor"]
      >,
      value: "",
    },
  },
};

export const MOCK_HTML = `
<table>
  <tr>
    <td>
      <p>Ajfon ten 16 giga</p>
    </td>
    <td>
      <img src="https://a.allegroimg.allegrosandbox.pl/original/110715/127374ac4b1dacacda72c8b003c7">
    </td>
  </tr>
</table>

  <ul>
    <li>Test 1</li>
    <li>Test 2</li>
    <li>Test 3</li>
  </ul>

  <ol>
    <li>Test 1</li>
    <li>Test 2</li>
    <li>Test 3</li>
  </ol>
`;
