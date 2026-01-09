# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
from typing import Any

from flask import request, Response
from flask_appbuilder.api import expose, protect, safe
from flask_babel import lazy_gettext as _

from superset.extensions import event_logger
from superset.llm.schemas import LLMAskPayloadSchema, LLMAskResponseSchema
from superset.views.base_api import BaseSupersetApi


class LLMRestApi(BaseSupersetApi):
    """
    LLM Rest API
    - Provides endpoints to interact with LLMs for dashboard Q&A
    """

    allow_browser_login = True
    resource_name = "llm"
    class_permission_name = "LLM"

    openapi_spec_tag = "LLM"
    apispec_parameter_schemas = {
        "llm_ask_payload_schema": LLMAskPayloadSchema,
        "llm_ask_response_schema": LLMAskResponseSchema,
    }

    @protect()
    @safe
    @expose("/ask", methods=("POST",))
    @event_logger.log_this_with_context(
        action=lambda self, *args, **kwargs: f"{self.__class__.__name__}.ask",
        log_to_statsd=False,
    )
    def ask(self, **kwargs: Any) -> Response:
        """Ask a question to the LLM about the dashboard.
        ---
        post:
          summary: Ask a question to the LLM
          description: >-
            Sends a question and context to the LLM and returns the answer.
          requestBody:
            required: true
            content:
              application/json:
                schema:
                  $ref: '#/components/schemas/llm_ask_payload_schema'
          responses:
            200:
              description: >-
                The answer from the LLM.
              content:
                application/json:
                  schema:
                    $ref: '#/components/schemas/llm_ask_response_schema'
            400:
              $ref: '#/components/responses/400'
            401:
              $ref: '#/components/responses/401'
            500:
              $ref: '#/components/responses/500'
        """
        try:
            payload = LLMAskPayloadSchema().load(request.json)
        except Exception as e:
            return self.response_400(message=str(e))

        question = payload.get("question")
        context = payload.get("context", {})

        # TODO: Integrate with actual LLM provider (OpenAI, Anthropic, etc.)
        # For now, we return a mock response.

        # Simple mock logic for demonstration
        answer = f"I received your question: '{question}'. "

        if context:
            answer += f"I analyzed {len(context)} data points from the dashboard. "
            # Basic analysis if context has chart data
            if "charts" in context:
                answer += f"It seems you have {len(context.get('charts', []))} charts. "

        answer += "Based on the data, the trend appears to be positive."

        return self.response(200, result=answer)
