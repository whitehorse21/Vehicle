const emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
const wordsWithoutNumbersRegex = /^[a-zA-Z\s]*$/i;
const dimensionsRegex = /^(\d+)(x(\d+))?(x(\d+))?$/igm

export const validateEmail = email => emailRegex.test(email);
export const validateName = name => name.length >= 1 && wordsWithoutNumbersRegex.test(name);
export const validateDimensions = dimension => dimension.match(dimensionsRegex);