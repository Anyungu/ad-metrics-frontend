export const fetAdMetrics = async (query: string): Promise<MessageType[]> => {
  const response = await fetch(
    `http://prometheus.localhost/api/v1/query?query=${encodeURIComponent(
      query
    )}`
  );
  if (!response.ok) throw new Error("Failed to fetch data");
  const result = await response.json();

  return result.data.result.map(
    (entry: { metric: { date: string }; value: string[] }) => ({
      date: entry.metric.date,
      impressions: parseFloat(entry.value[1]),
    })
  );
};
