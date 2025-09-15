export const splitThousands = (num: number): string[] => {
    const s = String(num);

    // Non-finite or scientific notation -> don't try to group
    if (!Number.isFinite(num) || /e|E/.test(s)) return [s];

    const isNegative = s.startsWith('-');
    const absStr = isNegative ? s.slice(1) : s;

    const [intRaw, frac] = absStr.split('.');
    // Preserve a single 0, but strip extra leading zeros
    const int = intRaw.replace(/^0+(?=\d)/, '') || '0';

    // Insert temporary spaces to split into thousands groups
    const groups = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ').split(' ');

    // Attach sign to the first group
    if (isNegative) groups[0] = '-' + groups[0];

    // If there is a fractional part, append it to the last group
    if (frac !== undefined) {
        groups[groups.length - 1] = `${groups[groups.length - 1]}.${frac}`;
    }

    return groups;
};

/**
 * @returns number surrounded by spaces. e.g. '4 000'
 */
export const spacedThousands = (num: number) => splitThousands(num).join(' ');

export const tokenizeText = (text: string): string[] => {
    return text
        .split(/(?<=[.!?])(?=\s+|$)|\n+/g)
        .map((sentence) => sentence.trim())
        .filter(Boolean);
};
