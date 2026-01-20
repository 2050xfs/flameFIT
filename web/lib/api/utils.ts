export const getDefaultMacroTargets = (weight?: number) => {
    // If we have weight, use a simple formula: ~35 cal/kg, 2g protein/kg
    const baseWeight = weight || 75; // default 75kg
    return {
        calories: Math.round(baseWeight * 35),
        protein: Math.round(baseWeight * 2),
        carbs: Math.round(baseWeight * 4),
        fats: Math.round(baseWeight * 1)
    };
};

export const clamp = (value: number, min = 0, max = 100) => Math.min(Math.max(value, min), max);

export const toTitle = (value?: string | null) => {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1);
};

export const formatTime = (value?: string | null) => {
    if (!value) return 'Today';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return 'Today';
    return parsed.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};
