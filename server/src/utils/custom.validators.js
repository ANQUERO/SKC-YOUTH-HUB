
export const isFirstName = value => {
    return /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(value);
};

export const isLastName = value => {
    return /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(value);
};

// Email format check
export const isEmail = value => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

// Password: 8 characters, at least 1 number, 1 special character, rest letters
export const isPassword = value => {
    const has8Chars = value.length === 8;
    const hasOneNumber = /[0-9]/.test(value);
    const hasOneSpecial = /[^A-Za-z0-9]/.test(value);
    const lettersCount = (value.match(/[A-Za-z]/g) || []).length;

    return has8Chars && hasOneNumber && hasOneSpecial && lettersCount >= 6;
};
