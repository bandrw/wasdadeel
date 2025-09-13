export const splitThousands = (num: number) => num.toString().split(/\B(?=(\d{3})+(?!\d))/g);

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
