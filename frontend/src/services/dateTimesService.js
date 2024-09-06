import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const toFormattedUserDateTime = (dateString) => {
  const date = dayjs(dateString);

  const threshold = 3; // days threshold for relative time

  if (date.isAfter(dayjs().subtract(threshold, "day"))) {
    // If the date is less than 3 days from the current moment, display a relative time string
    return date.fromNow();
  }

  // Otherwise, display a formatted date string
  return date.format("MMMM D, YYYY");
};

const toFormattedUserDate = (dateString) => {
  const date = dayjs(dateString);
  return date.format("MMMM D, YYYY");
};

export {
  toFormattedUserDateTime,
  toFormattedUserDate,
};
