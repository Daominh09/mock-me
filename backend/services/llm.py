"""
LLM abstraction layer.

All LLM calls in the app must go through this module.
Never import openai directly in views, models, or tasks.

Usage:
    from services.llm import llm

    response = llm.chat([
        {"role": "system", "content": "You are a technical interviewer."},
        {"role": "user",   "content": "Here is my solution..."},
    ])
    print(response)  # plain string
"""

import time
import logging
from django.conf import settings
import openai

logger = logging.getLogger(__name__)

# ── Retry config ─────────────────────────────────────────────────────────────
MAX_RETRIES = 3
RETRY_DELAY = 2  # seconds, doubles each attempt


class LLMClient:
    """
    Thin wrapper around the OpenAI API.

    Responsibilities:
    - Loads API key from settings
    - Retries on transient errors (rate limit, timeout, server error)
    - Formats messages consistently
    - Returns plain strings — callers never touch the raw API response
    """

    def __init__(self):
        self._client = None

    @property
    def client(self):
        """Lazy init — avoids crashing at import time if key is missing."""
        if self._client is None:
            api_key = getattr(settings, "OPENAI_API_KEY", None)
            if not api_key:
                raise RuntimeError(
                    "OPENAI_API_KEY is not set. Add it to your .env file."
                )
            self._client = openai.OpenAI(api_key=api_key)
        return self._client

    def chat(
        self,
        messages: list[dict],
        model: str = "gpt-4o-mini",
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> str:
        """
        Send a chat completion request and return the response as a plain string.

        Args:
            messages:    List of {"role": "system"|"user"|"assistant", "content": "..."}
            model:       OpenAI model ID
            temperature: Creativity (0 = deterministic, 1 = creative)
            max_tokens:  Max tokens in the response

        Returns:
            The assistant's reply as a plain string.

        Raises:
            RuntimeError: If all retries are exhausted.
        """
        last_error = None
        delay = RETRY_DELAY

        for attempt in range(1, MAX_RETRIES + 1):
            try:
                response = self.client.chat.completions.create(
                    model=model,
                    messages=messages,
                    temperature=temperature,
                    max_tokens=max_tokens,
                )
                return response.choices[0].message.content.strip()

            except openai.RateLimitError as e:
                logger.warning("LLM rate limit hit (attempt %d/%d): %s", attempt, MAX_RETRIES, e)
                last_error = e

            except openai.APITimeoutError as e:
                logger.warning("LLM timeout (attempt %d/%d): %s", attempt, MAX_RETRIES, e)
                last_error = e

            except openai.InternalServerError as e:
                logger.warning("LLM server error (attempt %d/%d): %s", attempt, MAX_RETRIES, e)
                last_error = e

            except openai.AuthenticationError as e:
                # Don't retry auth errors — key is wrong
                raise RuntimeError("Invalid OpenAI API key.") from e

            if attempt < MAX_RETRIES:
                time.sleep(delay)
                delay *= 2  # exponential backoff

        raise RuntimeError(
            f"LLM request failed after {MAX_RETRIES} attempts: {last_error}"
        )

    def build_messages(self, system: str, user: str) -> list[dict]:
        """Convenience helper to build a standard system + user message list."""
        return [
            {"role": "system", "content": system},
            {"role": "user",   "content": user},
        ]


# ── Singleton — import this everywhere ───────────────────────────────────────
llm = LLMClient()
