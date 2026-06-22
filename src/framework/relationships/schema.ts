import { z } from "zod";

import { moduleCodeSchema } from "../auth/schema";

export const relationshipTypeCodeSchema = z.string().check(z.regex(/^[a-z][a-z0-9_]*$/)).max(50);

export const recordRelationshipTypeSchema = z.object({
  id: z.uuid(),
  tenant_id: z.uuid().nullable(),
  code: relationshipTypeCodeSchema,
  name: z.string().min(1).max(100),
  description: z.string().nullable(),
  is_directed: z.boolean(),
  is_acyclic: z.boolean(),
  inverse_code: relationshipTypeCodeSchema.nullable(),
  applies_to_entity_types: z.array(moduleCodeSchema).nullable(),
  is_active: z.boolean()
});

export const relationshipEndpointSchema = z.object({
  tenantId: z.uuid(),
  entityType: moduleCodeSchema,
  entityId: z.uuid()
});

export const recordRelationshipRecordSchema = z.object({
  id: z.uuid(),
  tenant_id: z.uuid(),
  relationship_type_id: z.uuid(),
  source_entity_type: moduleCodeSchema,
  source_entity_id: z.uuid(),
  target_entity_type: moduleCodeSchema,
  target_entity_id: z.uuid(),
  metadata: z.record(z.string(), z.unknown()),
  effective_from: z.iso.datetime().nullable(),
  effective_to: z.iso.datetime().nullable()
});

export type RecordRelationshipType = z.infer<typeof recordRelationshipTypeSchema>;
export type RelationshipEndpoint = z.infer<typeof relationshipEndpointSchema>;
export type RecordRelationshipRecord = z.infer<typeof recordRelationshipRecordSchema>;

export type ExistingRelationshipPath = {
  ancestorEntityId: string;
  ancestorEntityType: string;
  descendantEntityId: string;
  descendantEntityType: string;
  relationshipTypeId: string;
};

export type ValidateRecordRelationshipInput = {
  allowedModuleCodes: readonly string[];
  existingPaths?: readonly ExistingRelationshipPath[];
  relationshipType: RecordRelationshipType;
  source: RelationshipEndpoint;
  target: RelationshipEndpoint;
};

export function validateRecordRelationship(input: ValidateRecordRelationshipInput) {
  const relationshipType = recordRelationshipTypeSchema.parse(input.relationshipType);
  const source = relationshipEndpointSchema.parse(input.source);
  const target = relationshipEndpointSchema.parse(input.target);

  if (source.tenantId !== target.tenantId) {
    throw new Error("Relationship endpoints must belong to the same tenant.");
  }

  if (relationshipType.tenant_id && relationshipType.tenant_id !== source.tenantId) {
    throw new Error("Relationship type does not belong to the same tenant.");
  }

  for (const endpoint of [source, target]) {
    if (!input.allowedModuleCodes.includes(endpoint.entityType)) {
      throw new Error("Relationship endpoint module is not allowlisted.");
    }

    if (
      relationshipType.applies_to_entity_types
      && !relationshipType.applies_to_entity_types.includes(endpoint.entityType)
    ) {
      throw new Error("Relationship type does not apply to one endpoint module.");
    }
  }

  if (relationshipType.is_acyclic) {
    const createsCycle = (input.existingPaths ?? []).some((path) =>
      path.relationshipTypeId === relationshipType.id
      && path.ancestorEntityType === target.entityType
      && path.ancestorEntityId === target.entityId
      && path.descendantEntityType === source.entityType
      && path.descendantEntityId === source.entityId
    );

    if (createsCycle) {
      throw new Error("Acyclic relationship would create a cycle.");
    }
  }

  return {
    relationshipType,
    source,
    target
  };
}
