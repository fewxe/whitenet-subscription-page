IGNORED_HEADERS = frozenset({
    "accept-encoding",
    "alt-svc",
    "authorization",
    "cache-control",
    "cf-access-client-id",
    "cf-access-client-secret",
    "cf-cache-status",
    "cf-connecting-ip",
    "cf-ray",
    "connection",
    "content-length",
    "content-security-policy",
    "cross-origin-opener-policy",
    "cross-origin-resource-policy",
    "expires",
    "fastly-client-ip",
    "forwarded",
    "forwarded-for",
    "host",
    "keep-alive",
    "nel",
    "origin-agent-cluster",
    "pragma",
    "proxy-authenticate",
    "proxy-authorization",
    "report-to",
    "server",
    "te",
    "trailer",
    "transfer-encoding",
    "true-client-ip",
    "upgrade",
    "x-api-key",
    "x-client-ip",
    "x-cluster-client-ip",
    "x-forwarded",
    "x-forwarded-for",
    "x-forwarded-proto",
    "x-forwarded-scheme",
    "x-real-ip",
    "x-remnawave-client-type",
    "x-remnawave-real-ip",
    "x-subpage-version",
})

_VPN_CLIENT_MARKERS = (
    "v2rayn",
    "v2rayng",
    "v2raytun",
    "clash",
    "sing-box",
    "happ",
    "streisand",
    "foxray",
    "shadowrocket",
    "nekoray",
    "nekobox",
    "stash",
    "flclash",
    "mihomo",
    "incy",
    "prizrak",
)


def is_vpn_client(user_agent: str) -> bool:
    ua = user_agent.lower()
    return any(m in ua for m in _VPN_CLIENT_MARKERS)


def filter_forwarded_headers(headers: dict[str, str]) -> dict[str, str]:
    return {k: v for k, v in headers.items() if k.lower() not in IGNORED_HEADERS}


def extract_client_ip(request_client_host: str | None, headers: dict[str, str]) -> str:
    lowered = {k.lower(): v for k, v in headers.items()}
    for header in ("cf-connecting-ip", "true-client-ip", "x-real-ip"):
        if value := lowered.get(header):
            return value.split(",")[0].strip()
    if value := lowered.get("x-forwarded-for"):
        return value.split(",")[0].strip()
    raw = request_client_host or "0.0.0.0"
    return raw.removeprefix("::ffff:")
