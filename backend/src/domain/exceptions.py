class SubscriptionNotFoundError(Exception):
    def __init__(self, short_uuid: str) -> None:
        self.short_uuid = short_uuid
        super().__init__(f"Subscription with short_uuid={short_uuid!r} not found")


class SubscriptionProviderUnavailableError(Exception):
    def __init__(self, short_uuid: str, reason: str) -> None:
        self.short_uuid = short_uuid
        self.reason = reason
        super().__init__(
            f"Subscription provider unavailable for short_uuid={short_uuid!r}: {reason}"
        )


class SubscriptionProviderResponseError(Exception):
    def __init__(self, short_uuid: str, reason: str) -> None:
        self.short_uuid = short_uuid
        self.reason = reason
        super().__init__(
            f"Invalid response from subscription provider for short_uuid={short_uuid!r}: {reason}"
        )
