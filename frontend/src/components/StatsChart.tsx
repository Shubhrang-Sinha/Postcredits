"use client";

interface StatsChartProps {
  title: string;
  data: { label: string; value: number }[];
  color?: string;
}

export default function StatsChart({
  title,
  data,
  color = "#06b6d4",
}: StatsChartProps) {
  if (data.length === 0) {
    return (
      <div className="p-4 border border-white/10 rounded bg-white/5">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-text-secondary text-sm mt-2">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="p-4 border border-border-subtle/20 rounded bg-bg-secondary/10">
      <h3 className="text-lg font-bold mb-4 block">{title}</h3>

      <div className="space-y-2">
        {data.slice(0, 10).map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-sm w-24 truncate text-text-secondary">
              {item.label}
            </span>
            <div
              className="h-6 rounded"
              style={{
                width: `${(item.value / maxValue) * 200}px`,
                backgroundColor: color,
                minWidth: item.value > 0 ? "4px" : "0",
              }}
            />
            <span className="text-text-secondary text-sm">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
