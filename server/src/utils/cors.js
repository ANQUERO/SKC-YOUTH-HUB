import { URL } from "node:url";

const isPrivateIpv4 = (hostname) => {
  const octets = hostname.split(".").map(Number);
  if (octets.length !== 4 || octets.some((part) => !Number.isInteger(part))) {
    return false;
  }

  return (
    octets[0] === 10 ||
    (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ||
    (octets[0] === 192 && octets[1] === 168)
  );
};

export const isLocalDevelopmentOrigin = (origin) => {
  try {
    const url = new URL(origin);
    const isVitePort = url.port === "5173" || url.port === "4173";
    const isLocalHost =
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "[::1]" ||
      isPrivateIpv4(url.hostname);

    return url.protocol === "http:" && isVitePort && isLocalHost;
  } catch {
    return false;
  }
};
