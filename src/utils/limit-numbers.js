const limitNumbers = (obj, key, maxLength) => {
    if (obj[key] && obj[key].length > maxLength) {
        setTimeout(() => {
            obj[key] = obj[key].slice(0, maxLength);
        }, 30)
    }
};

export { limitNumbers };
