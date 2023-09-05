export const tagify = (str) => {
    let strOut = str
      .replace(/[`~!@#$%^&*()_\-+=\[\]{};:'"\\|\/,.<>?\s]/g, ' ');
    strOut = strOut.replace(/\s+|\s+/gm, '');
    return strOut;
}