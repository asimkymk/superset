from typing import Any, Optional

from marshmallow import Schema, fields


class LLMAskPayloadSchema(Schema):
    question = fields.String(required=True)
    # Context can be a JSON object containing chart data or other context
    context = fields.Dict(keys=fields.String(), values=fields.Raw(), required=False)


class LLMAskResponseSchema(Schema):
    result = fields.String()
