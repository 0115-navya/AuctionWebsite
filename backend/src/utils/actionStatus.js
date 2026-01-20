export const getAuctionStatus = (startTime, endTime) => {
  const now = new Date();

  if (now < new Date(startTime)) return "upcoming";
  if (now > new Date(endTime)) return "ended";
  return "live";
};
