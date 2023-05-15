export function getUnwrappedQuery(q: string | (string | null)[]): string {
    if (q == null) return "";
    return q as string;
}
