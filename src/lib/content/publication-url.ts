const trailingCitationPunctuation = /[),.;:\]}]+$/;

const doiPattern = /(?:https?:\/\/(?:dx\.)?doi\.org\/|\bdoi\s*:\s*)(10\.\d{4,9}\/[^\s,;]+)/i;

export function extractDoi(value: string | null | undefined) {
  return value?.match(doiPattern)?.[1]?.replace(trailingCitationPunctuation, "");
}

export function extractFirstPublicationUrl(value: string | null | undefined) {
  const match = value?.match(/https?:\/\/[^\s<>"']+/i)?.[0];
  if (!match) return undefined;

  const candidate = match.replace(trailingCitationPunctuation, "");

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    url.protocol = "https:";
    return url.toString();
  } catch {
    return undefined;
  }
}

export function extractFirstHttpsUrl(value: string | null | undefined) {
  const match = value?.match(/https:\/\/[^\s<>"']+/i)?.[0];
  if (!match) return undefined;

  const candidate = match.replace(trailingCitationPunctuation, "");

  try {
    const url = new URL(candidate);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}
