export function clarify(body) {
    const result = {};
    for (const [key, value] of Object.entries(body)) {
        if (value !== null && value !== undefined) {
            result[key]=value;
        }
    }
    return result;
}
