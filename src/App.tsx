import { useState, useEffect } from 'react';
import { Plus, GitCompare } from 'lucide-react';
import { CoffeeBeanList } from './components/CoffeeBeanList';
import { CoffeeBeanDetail } from './components/CoffeeBeanDetail';
import { CoffeeBeanForm } from './components/CoffeeBeanForm';
import { BrewRecordForm } from './components/BrewRecordForm';
import { BrewRecordComparison } from './components/BrewRecordComparison';

export interface CoffeeBean {
  id: string;
  origin: string;
  farm: string;
  process: string;
  roastDate: string;
  createdAt: string;
  photo?: string; // Base64 encoded image
}

export interface FlavorProfile {
  acidity: number;
  sweetness: number;
  body: number;
  aroma: number;
  aftertaste: number;
}

export interface BrewRecord {
  id: string;
  coffeeBeanId: string;
  dripper: string;
  grinder: string;
  grindSetting: string;
  waterTemp: number;
  brewTime: string;
  flavorProfile: FlavorProfile;
  notes: string;
  brewDate: string;
}

export default function App() {
  const [coffeeBeans, setCoffeeBeans] = useState<CoffeeBean[]>([]);
  const [brewRecords, setBrewRecords] = useState<BrewRecord[]>([]);
  const [selectedBeanId, setSelectedBeanId] = useState<string | null>(null);
  const [showBeanForm, setShowBeanForm] = useState(false);
  const [showBrewForm, setShowBrewForm] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [editingBean, setEditingBean] = useState<CoffeeBean | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedBeans = localStorage.getItem('coffeeBeans');
    const savedRecords = localStorage.getItem('brewRecords');
    
    if (savedBeans) {
      setCoffeeBeans(JSON.parse(savedBeans));
    }
    if (savedRecords) {
      setBrewRecords(JSON.parse(savedRecords));
    }
  }, []);

  // Save coffee beans to localStorage
  useEffect(() => {
    if (coffeeBeans.length > 0 || localStorage.getItem('coffeeBeans')) {
      localStorage.setItem('coffeeBeans', JSON.stringify(coffeeBeans));
    }
  }, [coffeeBeans]);

  // Save brew records to localStorage
  useEffect(() => {
    if (brewRecords.length > 0 || localStorage.getItem('brewRecords')) {
      localStorage.setItem('brewRecords', JSON.stringify(brewRecords));
    }
  }, [brewRecords]);

  const handleAddBean = (bean: Omit<CoffeeBean, 'id' | 'createdAt'>) => {
    const newBean: CoffeeBean = {
      ...bean,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setCoffeeBeans([...coffeeBeans, newBean]);
    setShowBeanForm(false);
  };

  const handleUpdateBean = (bean: Omit<CoffeeBean, 'id' | 'createdAt'>) => {
    if (editingBean) {
      setCoffeeBeans(
        coffeeBeans.map((b) =>
          b.id === editingBean.id
            ? { ...bean, id: editingBean.id, createdAt: editingBean.createdAt }
            : b
        )
      );
      setEditingBean(null);
      setShowBeanForm(false);
    }
  };

  const handleDeleteBean = (id: string) => {
    setCoffeeBeans(coffeeBeans.filter((b) => b.id !== id));
    setBrewRecords(brewRecords.filter((r) => r.coffeeBeanId !== id));
    setSelectedBeanId(null);
  };

  const handleAddBrewRecord = (record: Omit<BrewRecord, 'id' | 'coffeeBeanId' | 'brewDate'>) => {
    if (selectedBeanId) {
      const newRecord: BrewRecord = {
        ...record,
        id: Date.now().toString(),
        coffeeBeanId: selectedBeanId,
        brewDate: new Date().toISOString(),
      };
      setBrewRecords([...brewRecords, newRecord]);
      setShowBrewForm(false);
    }
  };

  const handleDeleteBrewRecord = (id: string) => {
    setBrewRecords(brewRecords.filter((r) => r.id !== id));
  };

  const selectedBean = coffeeBeans.find((b) => b.id === selectedBeanId);
  const beanBrewRecords = brewRecords.filter((r) => r.coffeeBeanId === selectedBeanId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {showComparison ? (
        <div className="max-w-6xl mx-auto p-6">
          <BrewRecordComparison
            brewRecords={brewRecords}
            coffeeBeans={coffeeBeans}
            onBack={() => setShowComparison(false)}
          />
        </div>
      ) : !selectedBeanId && !showBeanForm ? (
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-amber-900 mb-2">手沖咖啡記錄</h1>
              <p className="text-amber-700">記錄您的咖啡豆與沖泡體驗</p>
            </div>
            <div className="flex gap-3">
              {brewRecords.length >= 2 && (
                <button
                  onClick={() => setShowComparison(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  <GitCompare className="w-5 h-5" />
                  比較記錄
                </button>
              )}
              <button
                onClick={() => setShowBeanForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-md"
              >
                <Plus className="w-5 h-5" />
                新增咖啡豆
              </button>
            </div>
          </div>

          <CoffeeBeanList
            beans={coffeeBeans}
            onSelectBean={setSelectedBeanId}
            onEditBean={(bean) => {
              setEditingBean(bean);
              setShowBeanForm(true);
            }}
            onDeleteBean={handleDeleteBean}
            brewRecordsCounts={coffeeBeans.map((bean) => ({
              beanId: bean.id,
              count: brewRecords.filter((r) => r.coffeeBeanId === bean.id).length,
            }))}
          />
        </div>
      ) : showBeanForm ? (
        <div className="max-w-2xl mx-auto p-6">
          <CoffeeBeanForm
            initialData={editingBean || undefined}
            onSubmit={editingBean ? handleUpdateBean : handleAddBean}
            onCancel={() => {
              setShowBeanForm(false);
              setEditingBean(null);
            }}
          />
        </div>
      ) : selectedBean && !showBrewForm ? (
        <div className="max-w-4xl mx-auto p-6">
          <CoffeeBeanDetail
            bean={selectedBean}
            brewRecords={beanBrewRecords}
            onBack={() => setSelectedBeanId(null)}
            onAddBrewRecord={() => setShowBrewForm(true)}
            onDeleteBrewRecord={handleDeleteBrewRecord}
          />
        </div>
      ) : (
        <div className="max-w-2xl mx-auto p-6">
          <BrewRecordForm
            brewRecords={brewRecords}
            onSubmit={handleAddBrewRecord}
            onCancel={() => setShowBrewForm(false)}
          />
        </div>
      )}
    </div>
  );
}