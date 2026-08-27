const isPersonName = (value) =>
    typeof value === "string" && /^[\p{L}' -]+$/u.test(value);

export const isFirstName = isPersonName;
export const isLastName = isPersonName;
export const isMiddleName = isPersonName;

export const isEmail = value => {
    return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export const isSuffix = value => {
    return /^(Jr\.|Sr\.|II|III|IV|V|VI|VII|VIII|IX|X)$/i.test(value);
};

export const isGender = value => {
    const val = String(value).toLowerCase();
    return val === "male" || val === "female";
};

export const isRole = value => {
    const normalizedValue = Array.isArray(value) ? value[0] : value;
    const val = String(normalizedValue).toLowerCase();
    return val === "super_official" || val === "natural_official";
};

const normalize = value =>
    typeof value === "string" ? value.trim().toLowerCase() : "";

export const isRegion = value => normalize(value) === "region vii";
export const isProvince = value => normalize(value) === "cebu";
export const isMunicipality = value => normalize(value) === "cordova";
export const isBarangay = value => {
    const normalized = normalize(value);
    return normalized === "catarman" || normalized.startsWith("catarman");
};

export const isPassword = value => {
    return typeof value === "string" &&
        value.length >= 8 &&
        /[a-z]/.test(value) &&
        /[A-Z]/.test(value) &&
        /[0-9]/.test(value) &&
        /[^A-Za-z0-9]/.test(value);
};

export const isContact = value => {
    return /^(\+63|63|0)9\d{9}$/.test(value);
};

export const isAge = value => {
    const age = Number(value);
    return Number.isInteger(age) && age >= 16 && age <= 30;
};
