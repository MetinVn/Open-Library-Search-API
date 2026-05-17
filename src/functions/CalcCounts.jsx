export const getClassByCount = (count) => {
  if (count === 0) return "text-red-500";
  if (count > 0 && count <= 5) return "text-red-500";
  if (count <= 100 && count > 5) return "text-yellow-500";
  if (count > 100) return "text-green-500";
  if (count > 1000) return "text-green-800";
};
export const getValueCount = (count) => {
  if (count === undefined || count === null || count === "" || !count) {
    return 0;
  } else {
    return count;
  }
};
