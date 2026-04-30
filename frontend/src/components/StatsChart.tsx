"use client";

import { Flex, Text, Box } from "@radix-ui/themes";

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
      <Box className="p-4 border border-white/10 rounded bg-white/5">
        <Text size="4" weight="bold">
          {title}
        </Text>
        <Text size="2" color="gray" className="mt-2 block">
          No data available
        </Text>
      </Box>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <Box className="p-4 border border-white/10 rounded bg-white/5">
      <Text size="4" weight="bold" mb="4" className="block">
        {title}
      </Text>

      <div className="space-y-2">
        {data.slice(0, 10).map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Text size="2" className="w-24 truncate">
              {item.label}
            </Text>
            <div
              className="h-6 rounded"
              style={{
                width: `${(item.value / maxValue) * 200}px`,
                backgroundColor: color,
                minWidth: item.value > 0 ? "4px" : "0",
              }}
            />
            <Text size="2" color="gray">
              {item.value}
            </Text>
          </div>
        ))}
      </div>
    </Box>
  );
}
