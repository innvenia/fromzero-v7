import {
  gridCustomFieldColumnSchema,
  gridModuleConfigSchema,
  gridRowActionPermissionMap,
  gridUserPreferenceSchema,
  type ResolveGridConfigurationInput,
  type ResolvedGridColumn,
  type ResolvedGridConfiguration
} from "./schema";

function customFieldTypeToGridType(fieldType: string): ResolvedGridColumn["type"] {
  if (fieldType === "number") {
    return "number";
  }

  if (fieldType === "boolean") {
    return "boolean";
  }

  if (fieldType === "date") {
    return "date";
  }

  if (fieldType === "email" || fieldType === "url") {
    return "link";
  }

  if (fieldType === "select" || fieldType === "multi-select") {
    return "badge";
  }

  return "text";
}

export function resolveGridConfiguration(input: ResolveGridConfigurationInput): ResolvedGridConfiguration {
  const moduleConfig = gridModuleConfigSchema.parse(input.module);
  const userPreference = input.userPreference
    ? gridUserPreferenceSchema.parse(input.userPreference)
    : null;
  const customColumns = (input.customFields ?? []).map((customField) => {
    const parsedCustomField = gridCustomFieldColumnSchema.parse(customField);

    return {
      field: parsedCustomField.field_name,
      filterable: parsedCustomField.is_filterable,
      label_key: `custom_field.${parsedCustomField.field_name}`,
      sortable: false,
      type: customFieldTypeToGridType(parsedCustomField.field_type),
      visible: true
    } satisfies ResolvedGridColumn;
  });

  const allColumns = [...moduleConfig.grid_columns, ...customColumns];
  const columnByField = new Map(allColumns.map((column) => [column.field, column]));

  const columns = userPreference?.columns
    ? userPreference.columns.map((field) => {
        const column = columnByField.get(field);

        if (!column) {
          throw new Error("Grid preference references a column outside the grid.");
        }

        return column;
      })
    : allColumns.filter((column) => column.visible);

  const sort = userPreference?.sort ?? moduleConfig.grid_default_sort;

  if (sort) {
    const sortColumn = columnByField.get(sort.field);

    if (!sortColumn?.sortable) {
      throw new Error("Grid sort field is not sortable.");
    }
  }

  const allowedActionSet = new Set(input.allowedActions);
  const rowActions = moduleConfig.grid_row_actions.filter((action) =>
    allowedActionSet.has(gridRowActionPermissionMap[action])
  );

  return {
    columns,
    pageSize: userPreference?.pageSize ?? moduleConfig.grid_default_page_size ?? 25,
    rowActions,
    sort
  };
}
