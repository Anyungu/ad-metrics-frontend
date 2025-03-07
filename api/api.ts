export const fetAdMetrics = async (query: string): Promise<any> => {
  try {
    const response = await fetch(
      `http://prometheus.localhost/api/v1/query?query=${encodeURIComponent(
        query
      )}`
    );
    if (!response.ok) throw new Error("Failed to fetch data");
    const result = await response.json();

    return result.data.result.map((entry: any) => ({
      date: entry.metric.date,
      impressions: parseFloat(entry.value[1]),
    }));
  } catch (error) {
    console.error(error);
    return null;
  }
};
