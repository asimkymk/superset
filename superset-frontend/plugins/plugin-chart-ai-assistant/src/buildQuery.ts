import { buildQueryContext, QueryFormData } from '@superset-ui/core';

export default function buildQuery(formData: QueryFormData) {
  // The AI Assistant doesn't necessarily need a dataset query,
  // but Superset expects this. We can return a minimal query.
  return buildQueryContext(formData, baseQueryObject => [
    {
      ...baseQueryObject,
    },
  ]);
}
