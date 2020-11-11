export const copyStrToClipboard = str => navigator.clipboard.writeText(str).then(resolve => resolve);

export const strCenterEllipsis = (str, width = 4) => str
  ? str.length > ((width * 2) + 3)
    ? `${str.substr(0, width + 2)}...${str.substr(-width, width)}`
    : str
  : '';