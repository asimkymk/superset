import { ChartProps } from '@superset-ui/core';

export default function transformProps(chartProps: ChartProps) {
  const { width, height, formData } = chartProps;
  return {
    width,
    height,
    formData,
  };
}
