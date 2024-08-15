
export function validateIPv4Address(ip: string): boolean {
    const parts = ip.split(".");
    if (parts.length !== 4) return false;

    return parts.every(part => {
        const num = Number(part);
        return num >= 0 && num <= 255 && part === num.toString();
    });
}

export function validateMTU(mtu: number): boolean {
    const minMTU = 1280;
    const maxMTU = 1500;

    return mtu >= minMTU && mtu <= maxMTU;
}