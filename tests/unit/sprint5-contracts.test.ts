import { describe, expect, it } from "vitest";

import {
  apiEndpointContractSchema,
  sprintFiveApiContracts,
  sprintFourApiContracts,
  sprintThreeApiContracts
} from "../../src/framework/api";
import { coreModuleDefinitions } from "../../src/framework/bootstrap";
import {
  buildFactoryListRequest,
  sprintFiveModuleFactoryContractSchema
} from "../../src/framework/factory";
import {
  gridRowActionPermissionMap,
  resolveGridConfiguration
} from "../../src/framework/grid";
import {
  assertCustomFieldLimit,
  customFieldRecordSchema,
  filterRecordSchema,
  isFilterVisibleToUser,
  validateCustomFieldDefinition,
  validateFilterAgainstGrid
} from "../../src/framework/modules";
import {
  recordRelationshipTypeSchema,
  validateRecordRelationship
} from "../../src/framework/relationships";

const tenantId = "22222222-2222-4222-8222-222222222222";
const otherTenantId = "33333333-3333-4333-8333-333333333333";
const userId = "11111111-1111-4111-8111-111111111111";
const otherUserId = "99999999-9999-4999-8999-999999999999";
const sourceRecordId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const targetRecordId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

const allowedModuleCodes = coreModuleDefinitions.map((moduleDefinition) => moduleDefinition.code);

const moduleContract = sprintFiveModuleFactoryContractSchema.parse({
  code: "task",
  tableName: "tasks",
  displayField: "title",
  tenantScoped: true,
  allowedOperations: ["list", "create", "update", "delete"],
  allowedFilterFields: ["status", "priority"],
  allowedSortFields: ["title", "created_at"],
  defaultPageSize: 25,
  maxPageSize: 100,
  permissionMap: {
    list: "view",
    create: "create",
    update: "update",
    delete: "delete"
  }
});

const gridModule = {
  code: "task",
  display_field: "title",
  display_subtitle_field: "status",
  grid_columns: [
    {
      field: "title",
      label_key: "task.fields.title",
      type: "text",
      sortable: true,
      filterable: true,
      visible: true
    },
    {
      field: "status",
      label_key: "task.fields.status",
      type: "badge",
      sortable: true,
      filterable: true,
      visible: true
    }
  ],
  grid_default_page_size: 25,
  grid_default_sort: {
    field: "title",
    direction: "asc"
  },
  grid_row_actions: ["view", "edit", "delete", "duplicate"]
} as const;

describe("Sprint 5 contracts", () => {
  it("adds reserved API contracts for Sprint 5 modules", () => {
    const parsedContracts = [
      ...sprintThreeApiContracts,
      ...sprintFourApiContracts,
      ...sprintFiveApiContracts
    ].map((contract) => apiEndpointContractSchema.parse(contract));

    expect(parsedContracts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ basePath: "/api/v1/custom-fields", ownerSprint: "Sprint 5" }),
        expect.objectContaining({ basePath: "/api/v1/filters", ownerSprint: "Sprint 5" }),
        expect.objectContaining({ basePath: "/api/v1/relationships", ownerSprint: "Sprint 5" })
      ])
    );
  });

  it("rejects unbounded factory list requests and non-allowlisted fields", () => {
    expect(() =>
      buildFactoryListRequest(moduleContract, {
        tenantId,
        page: 1,
        sort: { field: "title", direction: "asc" }
      })
    ).toThrow("pageSize is required");

    expect(() =>
      buildFactoryListRequest(moduleContract, {
        tenantId,
        page: 1,
        pageSize: 25,
        sort: { field: "deleted_at", direction: "desc" }
      })
    ).toThrow("Sort field is not allowlisted");

    expect(
      buildFactoryListRequest(moduleContract, {
        tenantId,
        page: 2,
        pageSize: 25,
        sort: { field: "title", direction: "asc" },
        filters: { status: "open" }
      })
    ).toEqual(
      expect.objectContaining({
        limit: 25,
        offset: 25,
        tenantId
      })
    );
  });

  it("validates custom field allowlists, options and value limits", () => {
    const customField = customFieldRecordSchema.parse({
      id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      tenant_id: tenantId,
      entity_type: "task",
      field_name: "tax_id",
      labels: { es: "RFC", en: "Tax ID" },
      field_type: "select",
      options: [
        { value: "mx", labels: { es: "México", en: "Mexico" } }
      ],
      is_required: true,
      is_filterable: true,
      default_value: "mx",
      sort_order: 10,
      is_active: true
    });

    expect(validateCustomFieldDefinition(customField, allowedModuleCodes)).toEqual(customField);
    expect(() => validateCustomFieldDefinition({ ...customField, entity_type: "unknown" }, allowedModuleCodes))
      .toThrow("Custom field module is not allowlisted");
    expect(() => validateCustomFieldDefinition({ ...customField, default_value: "ca" }, allowedModuleCodes))
      .toThrow("Custom field default value is not in the select options");

    const multiSelectField = customFieldRecordSchema.parse({
      ...customField,
      field_name: "countries",
      field_type: "multi-select",
      options: [
        { value: "mx", labels: { es: "México", en: "Mexico" } },
        { value: "us", labels: { es: "Estados Unidos", en: "United States" } }
      ],
      default_value: ["mx", "us"]
    });

    expect(validateCustomFieldDefinition(multiSelectField, allowedModuleCodes)).toEqual(multiSelectField);
    expect(() => validateCustomFieldDefinition({ ...multiSelectField, default_value: ["ca"] }, allowedModuleCodes))
      .toThrow("Custom field default values are not in the select options");
    expect(() => assertCustomFieldLimit(50, 50)).toThrow("Custom field limit exceeded");
    expect(assertCustomFieldLimit(49, 50)).toBe(true);
  });

  it("validates filter ownership, sharing and grid field allowlists", () => {
    const privateFilter = filterRecordSchema.parse({
      id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      user_id: userId,
      tenant_id: tenantId,
      module_code: "task",
      name: "Open tasks",
      conditions: [
        { field: "status", operator: "equals", value: "open" }
      ],
      sort_config: { field: "title", direction: "asc" },
      visible_columns: ["title", "status"],
      is_default: false,
      is_shared: false
    });

    expect(isFilterVisibleToUser(privateFilter, { tenantId, userId })).toBe(true);
    expect(isFilterVisibleToUser(privateFilter, { tenantId, userId: otherUserId })).toBe(false);
    expect(
      isFilterVisibleToUser({ ...privateFilter, is_shared: true }, { tenantId, userId: otherUserId })
    ).toBe(true);

    expect(validateFilterAgainstGrid(privateFilter, gridModule, allowedModuleCodes)).toEqual(privateFilter);
    expect(() =>
      validateFilterAgainstGrid({ ...privateFilter, visible_columns: ["unknown"] }, gridModule, allowedModuleCodes)
    ).toThrow("Filter references a column outside the grid");
  });

  it("resolves grid preferences, custom columns and RBAC row actions", () => {
    const grid = resolveGridConfiguration({
      module: gridModule,
      customFields: [
        {
          field_name: "tax_id",
          field_type: "text",
          labels: { es: "RFC", en: "Tax ID" },
          is_filterable: true
        }
      ],
      userPreference: {
        columns: ["status", "tax_id"],
        pageSize: 10,
        sort: { field: "status", direction: "desc" }
      },
      allowedActions: ["view", "update"]
    });

    expect(grid.columns.map((column) => column.field)).toEqual(["status", "tax_id"]);
    expect(grid.pageSize).toBe(10);
    expect(grid.sort).toEqual({ field: "status", direction: "desc" });
    expect(grid.rowActions).toEqual(["view", "edit"]);
    expect(gridRowActionPermissionMap.duplicate).toBe("create");
  });

  it("rejects cross-tenant and cyclic record relationships", () => {
    const relationshipType = recordRelationshipTypeSchema.parse({
      id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      tenant_id: null,
      code: "parent_of",
      name: "Parent of",
      description: null,
      is_directed: true,
      is_acyclic: true,
      inverse_code: "child_of",
      applies_to_entity_types: ["task", "document"],
      is_active: true
    });

    expect(() =>
      validateRecordRelationship({
        relationshipType,
        source: { tenantId, entityType: "task", entityId: sourceRecordId },
        target: { tenantId: otherTenantId, entityType: "task", entityId: targetRecordId },
        allowedModuleCodes
      })
    ).toThrow("Relationship endpoints must belong to the same tenant");

    expect(() =>
      validateRecordRelationship({
        relationshipType,
        source: { tenantId, entityType: "task", entityId: sourceRecordId },
        target: { tenantId, entityType: "task", entityId: targetRecordId },
        allowedModuleCodes,
        existingPaths: [
          {
            ancestorEntityType: "task",
            ancestorEntityId: targetRecordId,
            descendantEntityType: "task",
            descendantEntityId: sourceRecordId,
            relationshipTypeId: relationshipType.id
          }
        ]
      })
    ).toThrow("Acyclic relationship would create a cycle");
  });
});
