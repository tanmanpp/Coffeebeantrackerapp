import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { FlavorProfile } from '../App';

interface FlavorRadarChartProps {
  flavorProfile: FlavorProfile;
}

export function FlavorRadarChart({ flavorProfile }: FlavorRadarChartProps) {
  const data = [
    { subject: '酸度', value: flavorProfile.acidity, fullMark: 5 },
    { subject: '甜度', value: flavorProfile.sweetness, fullMark: 5 },
    { subject: '醇厚度', value: flavorProfile.body, fullMark: 5 },
    { subject: '香氣', value: flavorProfile.aroma, fullMark: 5 },
    { subject: '餘韻', value: flavorProfile.aftertaste, fullMark: 5 },
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <RadarChart data={data}>
        <PolarGrid stroke="#f59e0b" strokeOpacity={0.3} />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: '#92400e', fontSize: 12 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 5]}
          tick={{ fill: '#92400e', fontSize: 10 }}
        />
        <Radar
          name="風味"
          dataKey="value"
          stroke="#f59e0b"
          fill="#f59e0b"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
