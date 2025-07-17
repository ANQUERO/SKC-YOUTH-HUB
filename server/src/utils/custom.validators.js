
export const isFirstName = value => {
    return /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(value);
};

export const isLastName = value => {
    return /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(value);
};

export const isMiddleName = value => {
    return /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(value);
}

export const isEmail = value => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export const isSuffix = value => {
    return /\b(Jr\.|Sr\.|I{2,4}|IV|V|VI{0,3}|X)\b/.test(value);
}

export const isGender = value => {
    const val = String(value).toLowerCase();
    return val === "male" || val === "female";
};

export const isRole = value => {
    const val = String(value).toLowerCase();
    return val === "super_sk_admin" || val === "natural_sk_admin";
};

const normalize = value =>
    typeof value === 'string' ? value.trim().toLowerCase() : '';

export const isRegion = value => normalize(value) === "region vii";
export const isProvince = value => normalize(value) === "cebu";
export const isMunicipality = value => normalize(value) === "cordova";
export const isBarangay = value => normalize(value) === "catarman";

// Password: 8 characters, at least 1 number, 1 special character, rest letters
export const isPassword = value => {
    const has8Chars = value.length === 8;
    const hasOneNumber = /[0-9]/.test(value);
    const hasOneSpecial = /[^A-Za-z0-9]/.test(value);
    const lettersCount = (value.match(/[A-Za-z]/g) || []).length;

    return has8Chars && hasOneNumber && hasOneSpecial && lettersCount >= 6;
};

export const isContact = value => {
    return /^(\+63|63|0)9\d{9}$/.text(value);
}

export const isAge = value => {
    const age = Number(value);
    return Number.isInteger(age) && age >= 16 && age <= 30;
}

