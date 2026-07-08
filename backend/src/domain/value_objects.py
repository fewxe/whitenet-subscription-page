import re
from typing import Annotated

from pydantic import AfterValidator

_SHORT_UUID_RE = re.compile(r"^[A-Za-z0-9_\-]{8,32}$")


def _validate_short_uuid(value: str) -> str:
    if not _SHORT_UUID_RE.match(value):
        raise ValueError(f"Invalid shortUuid: {value!r}")
    return value


ShortUuid = Annotated[str, AfterValidator(_validate_short_uuid)]
