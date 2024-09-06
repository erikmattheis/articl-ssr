const isNumber = (n) => !Number.isNaN(parseFloat(n)) && !Number.isNaN(n - 0);

const noCaseIndexOf = (str, subString) => {
  if (!str || !subString) {
    return -1;
  }

  return str.toLowerCase().indexOf(subString.toLowerCase());
};

const highlightedSubstring = (str, subString, part) => {
  if (!subString && part === "prefix") {
    return str;
  }

  if (!subString && part !== "prefix") {
    return "";
  }

  const position = noCaseIndexOf(str, subString);

  if (part === "prefix") {
    return str.slice(0, Math.max(0, position));
  }

  if (part === "term") {
    return str.substring(position, position + subString.length);
  }

  if (part === "suffix") {
    return str.slice(Math.max(0, position + subString.length));
  }

  return str;
};
const toListWithOptionalConjuction = (array, conj = "") => {
  if (!array || array.length === 0 || !Array.isArray(array)) {
    return "";
  }

  return (
    array.slice(0, -1).join(", ") + (array.length > 1 ? ` ${conj} ` : "") + array[array.length - 1]
  );
};



const convertAuthorArrayToString = (srt) => {
  if (typeof srt === "string") {
    return srt;
  }
  if (typeof srt[0] === "string") {
    return srt.join(", ");
  }
  if (!srt.map) {
    return srt;
  }
  return srt.map((author) => `${author.nameLast}, ${author.nameFirst}`).join(", ");
}

const highlightMatchedText = (text, searchTerm) => {
  if (!text || text.length === 0 || !searchTerm || searchTerm.length === 0) {
    return text;
  }
  //text = convertAuthorArrayToString(text);
  const regex = new RegExp(searchTerm, "gi");
  if (text.replace) {
    return text.replace(regex, "<span class=\"green\">$&</span>");
  }
  return text;
}

const convertStringDatesToMS = (tokens) => {
  const result = JSON.parse(JSON.stringify(tokens));

  result.access.token = tokens.access.token;
  result.access.expires = Date.parse(
    tokens.access.expires,
  );

  result.refresh.token = tokens.refresh.token;
  result.refresh.expires = Date.parse(
    tokens.refresh.expires,
  );

  return result;
};

const urlParamIsFalsy = (param) => {
  return param === "" || param === "null" || param === "unk/;8/fined";
}

export {
  highlightedSubstring,
  isNumber,
  noCaseIndexOf,
  toListWithOptionalConjuction,
  convertAuthorArrayToString,
  convertStringDatesToMS,
  highlightMatchedText,
  urlParamIsFalsy,
};
