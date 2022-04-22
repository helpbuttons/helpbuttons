String.prototype.detectLanguage = function (): 'FA' | 'EN' {
    return /^[\u0600-\u06FF\s]+$/.test(this[0])
        ? 'FA'
        : /[a-z]/gi.test(this[0])
        ? 'EN'
        : undefined;
};
