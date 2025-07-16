import { pool } from '../db/config.js'

//Acccepted Locations
const knownLocations = [
    "Region VII",
    "Cebu",
    "Cordova",
    "Catarman"
]

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

export const isLocation = value => {
    if (typeof value !== 'string') return false;
    const locationStringOnly = value.trim().toLowerCase();
    return knownLocations.includes(locationStringOnly);
}

// Password: 8 characters, at least 1 number, 1 special character, rest letters
export const isPassword = value => {
    const has8Chars = value.length === 8;
    const hasOneNumber = /[0-9]/.test(value);
    const hasOneSpecial = /[^A-Za-z0-9]/.test(value);
    const lettersCount = (value.match(/[A-Za-z]/g) || []).length;

    return has8Chars && hasOneNumber && hasOneSpecial && lettersCount >= 6;
};
