import short from "short-uuid";

export const dateFormatter = (date) => {
  return date.toString().slice(0,25)
}

export const isJson = (item) => {
  let value = typeof item !== "string" ? JSON.stringify(item) : item;

  try {
    value = JSON.parse(value);
  } catch (e) {
    return false;
  }
    
  return typeof value === "object" && value !== null;
}

export const generateId = () => {
  return short.generate()
}