import { useState } from 'react';
import { ArrowLeft, Thermometer, Clock, Coffee } from 'lucide-react';
import { BrewRecord, CoffeeBean, FlavorProfile } from '../App';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

interface BrewRecordComparisonProps {
  brewRecords: BrewRecord[];
  coffeeBeans: CoffeeBean[];
  onBack: () => void;
}

export function BrewRecordComparison({ brewRecords, coffeeBeans, onBack }: BrewRecordComparisonProps) {
  const [record1Id, setRecord1Id] = useState<string>('');
  const [record2Id, setRecord2Id] = useState<string>('');

  const record1 = brewRecords.find((r) => r.id === record1Id);
  const record2 = brewRecords.find((r) => r.id === record2Id);

  const bean1 = record1 ? coffeeBeans.find((b) => b.id === record1.coffeeBeanId) : undefined;
  const bean2 = record2 ? coffeeBeans.find((b) => b.id === record2.coffeeBeanId) : undefined;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getComparisonData = () => {
    if (!record1 || !record2) return [];

    return [
      {
        subject: '酸度',
        record1: record1.flavorProfile.acidity,
        record2: record2.flavorProfile.acidity,
        fullMark: 5,
      },
      {
        subject: '甜度',
        record1: record1.flavorProfile.sweetness,
        record2: record2.flavorProfile.sweetness,
        fullMark: 5,
      },
      {
        subject: '醇厚度',
        record1: record1.flavorProfile.body,
        record2: record2.flavorProfile.body,
        fullMark: 5,
      },
      {
        subject: '香氣',
        record1: record1.flavorProfile.aroma,
        record2: record2.flavorProfile.aroma,
        fullMark: 5,
      },
      {
        subject: '餘韻',
        record1: record1.flavorProfile.aftertaste,
        record2: record2.flavorProfile.aftertaste,
        fullMark: 5,
      },
    ];
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-amber-700 hover:text-amber-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        返回主頁
      </button>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <h1 className="text-amber-900 mb-6">沖泡記錄比較</h1>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm text-amber-700 mb-2">選擇第一筆記錄</label>
            <select
              value={record1Id}
              onChange={(e) => setRecord1Id(e.target.value)}
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">請選擇記錄</option>
              {brewRecords.map((record) => {
                const bean = coffeeBeans.find((b) => b.id === record.coffeeBeanId);
                return (
                  <option key={record.id} value={record.id}>
                    {bean?.origin} - {bean?.farm} ({formatDate(record.brewDate)})
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm text-amber-700 mb-2">選擇第二筆記錄</label>
            <select
              value={record2Id}
              onChange={(e) => setRecord2Id(e.target.value)}
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">請選擇記錄</option>
              {brewRecords.map((record) => {
                const bean = coffeeBeans.find((b) => b.id === record.coffeeBeanId);
                return (
                  <option key={record.id} value={record.id}>
                    {bean?.origin} - {bean?.farm} ({formatDate(record.brewDate)})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {record1 && record2 && (
          <div className="space-y-6">
            {/* Flavor Radar Chart Comparison */}
            <div className="bg-amber-50 rounded-lg p-6">
              <h2 className="text-amber-900 mb-4">風味表現比較</h2>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={getComparisonData()}>
                  <PolarGrid stroke="#f59e0b" strokeOpacity={0.3} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#92400e', fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: '#92400e', fontSize: 10 }} />
                  <Radar
                    name={`${bean1?.origin} (${formatDate(record1.brewDate)})`}
                    dataKey="record1"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.5}
                  />
                  <Radar
                    name={`${bean2?.origin} (${formatDate(record2.brewDate)})`}
                    dataKey="record2"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.5}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Side by Side Comparison */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Record 1 */}
              <div className="bg-amber-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Coffee className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-amber-900">{bean1?.origin}</h3>
                    <p className="text-sm text-amber-600">{bean1?.farm}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-amber-600 mb-1">沖泡日期</p>
                    <p className="text-sm text-amber-900">{formatDate(record1.brewDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-amber-600 mb-1">濾杯</p>
                    <p className="text-sm text-amber-900">{record1.dripper}</p>
                  </div>
                  <div>
                    <p className="text-xs text-amber-600 mb-1">磨豆機</p>
                    <p className="text-sm text-amber-900">{record1.grinder}</p>
                  </div>
                  <div>
                    <p className="text-xs text-amber-600 mb-1">研磨刻度</p>
                    <p className="text-sm text-amber-900">{record1.grindSetting}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-amber-600" />
                    <p className="text-sm text-amber-900">{record1.waterTemp}°C</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <p className="text-sm text-amber-900">{record1.brewTime}</p>
                  </div>
                  {record1.notes && (
                    <div>
                      <p className="text-xs text-amber-600 mb-1">品飲筆記</p>
                      <p className="text-sm text-amber-900">{record1.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Record 2 */}
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                    <Coffee className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-blue-900">{bean2?.origin}</h3>
                    <p className="text-sm text-blue-600">{bean2?.farm}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-blue-600 mb-1">沖泡日期</p>
                    <p className="text-sm text-blue-900">{formatDate(record2.brewDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 mb-1">濾杯</p>
                    <p className="text-sm text-blue-900">{record2.dripper}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 mb-1">磨豆機</p>
                    <p className="text-sm text-blue-900">{record2.grinder}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 mb-1">研磨刻度</p>
                    <p className="text-sm text-blue-900">{record2.grindSetting}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-blue-600" />
                    <p className="text-sm text-blue-900">{record2.waterTemp}°C</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <p className="text-sm text-blue-900">{record2.brewTime}</p>
                  </div>
                  {record2.notes && (
                    <div>
                      <p className="text-xs text-blue-600 mb-1">品飲筆記</p>
                      <p className="text-sm text-blue-900">{record2.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Difference Analysis */}
            <div className="bg-gradient-to-r from-amber-50 to-blue-50 rounded-lg p-6">
              <h2 className="text-gray-900 mb-4">差異分析</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">水溫差異</p>
                  <p className="text-gray-900">
                    {Math.abs(record1.waterTemp - record2.waterTemp) === 0
                      ? '相同'
                      : `相差 ${Math.abs(record1.waterTemp - record2.waterTemp)}°C`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">濾杯</p>
                  <p className="text-gray-900">
                    {record1.dripper === record2.dripper ? '相同' : '不同'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">磨豆機</p>
                  <p className="text-gray-900">
                    {record1.grinder === record2.grinder ? '相同' : '不同'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">咖啡豆</p>
                  <p className="text-gray-900">
                    {record1.coffeeBeanId === record2.coffeeBeanId ? '相同豆子' : '不同豆子'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {(!record1 || !record2) && (
          <div className="text-center py-12 text-amber-600">
            請選擇兩筆記錄進行比較
          </div>
        )}
      </div>
    </div>
  );
}
