import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { useTheme } from "@primer/react";
import { CategoryScale, Chart, LinearScale, LineController, LineElement, PointElement } from "chart.js";
import { GraphIcon } from "@primer/octicons-react";
import { AbstractWidgetDefinition } from "../common/widgets/abstract-widget-definition";
import { WidgetConfigComponent, WidgetDisplayComponent } from "../common/widgets/types";
import { NpmConfigInput } from "../components/common/npm-config-input";
import { useNpmRangeDownloadCount } from "../common/use-npm-range-download-count";
import { LoadingWidgetEmptyState } from "../components/common/empty-states/loading-widget-empty-state";

Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(LineController);
Chart.register(LineElement);
Chart.register(PointElement);

type NpmDownloadWidgetConfig = {
  packageName: string;
  range: string;
};

const ConfigComponent: WidgetConfigComponent<NpmDownloadWidgetConfig> = ({ config, onChange }) => {
  return (
    <NpmConfigInput
      packageName={config.packageName}
      range={config.range}
      onChangePackageName={(value) => onChange({ ...config, packageName: value })}
      onChangeRange={(value) => onChange({ ...config, range: value })}
    />
  );
};

const DisplayComponent: WidgetDisplayComponent<NpmDownloadWidgetConfig> = ({ config }) => {
  const { theme } = useTheme();
  const { data } = useNpmRangeDownloadCount(config.packageName, config.range);

  const labels = useMemo(() => data?.downloads?.map((d) => d.day), [data]);
  const downloads = useMemo(() => data?.downloads?.map((d) => d.downloads), [data]);

  if (!data) {
    return <LoadingWidgetEmptyState />;
  }

  return (
    <Line
      options={{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false }, ticks: { display: false } },
        },
        elements: { point: { radius: 0 } },
      }}
      data={{
        labels,
        datasets: [{ label: "", data: downloads, borderColor: theme?.colors.accent.emphasis }],
      }}
    />
  );
};

export class NpmDownloadGraphWidget extends AbstractWidgetDefinition<NpmDownloadWidgetConfig> {
  override id = "npmDownloadGraph";

  override name = "NPM Downloads Graph";

  override displayComponent = DisplayComponent;

  override configComponent = ConfigComponent;

  override iconComponent = () => <GraphIcon size={16} />;

  override generalIconComponent = () => <GraphIcon size={16} />;

  override async generateDefaultConfig(): Promise<NpmDownloadWidgetConfig> {
    return {
      packageName: "axios",
      range: "last-month",
    };
  }

  readonly defaultSize = [5, 2] as const;
}
