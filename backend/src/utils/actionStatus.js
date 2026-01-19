export const getAuctionStatus = (startTime, endTime) => {
  const now = new Date();

  if (now < startTime) return "upcoming";
  if (now >= startTime && now <= endTime) return "live";
  return "ended";
};
