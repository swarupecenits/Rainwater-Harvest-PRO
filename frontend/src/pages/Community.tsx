import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AwardIcon,
  BarChart2Icon,
  CalendarIcon,
  DropletIcon,
  GiftIcon,
  MedalIcon,
  TrophyIcon,
  TrendingUpIcon,
  UsersIcon
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/ui/Card';

type Timeframe = 'weekly' | 'monthly' | 'yearly';

interface FamilyRecord {
  id: string;
  name: string;
  location: string;
  members: number;
  goalLiters: number;
  lastUpdated: string;
  savings: Record<Timeframe, number>;
  monthlyBreakdown: { month: string; liters: number }[];
  achievements: string[];
}

const families: FamilyRecord[] = [
  {
    id: 'HH-001',
    name: 'Sharma Family',
    location: 'Indiranagar, Bengaluru',
    members: 4,
    goalLiters: 18000,
    lastUpdated: '2025-09-23',
    savings: {
      weekly: 420,
      monthly: 1780,
      yearly: 16420
    },
    monthlyBreakdown: [
      { month: 'Jan', liters: 1280 },
      { month: 'Feb', liters: 1420 },
      { month: 'Mar', liters: 1520 },
      { month: 'Apr', liters: 1620 },
      { month: 'May', liters: 1740 },
      { month: 'Jun', liters: 1680 },
      { month: 'Jul', liters: 1540 },
      { month: 'Aug', liters: 1480 },
      { month: 'Sep', liters: 1660 },
      { month: 'Oct', liters: 1520 },
      { month: 'Nov', liters: 1400 },
      { month: 'Dec', liters: 1480 }
    ],
    achievements: [
      'Installed rooftop filtration upgrade',
      'Led community rain-garden workshop'
    ]
  },
  {
    id: 'HH-002',
    name: 'Nair Household',
    location: 'HSR Layout, Bengaluru',
    members: 3,
    goalLiters: 15000,
    lastUpdated: '2025-09-22',
    savings: {
      weekly: 360,
      monthly: 1540,
      yearly: 14860
    },
    monthlyBreakdown: [
      { month: 'Jan', liters: 980 },
      { month: 'Feb', liters: 1110 },
      { month: 'Mar', liters: 1340 },
      { month: 'Apr', liters: 1460 },
      { month: 'May', liters: 1580 },
      { month: 'Jun', liters: 1660 },
      { month: 'Jul', liters: 1620 },
      { month: 'Aug', liters: 1540 },
      { month: 'Sep', liters: 1700 },
      { month: 'Oct', liters: 1580 },
      { month: 'Nov', liters: 1400 },
      { month: 'Dec', liters: 1490 }
    ],
    achievements: [
      'Rain barrel automation pilot',
      'Monthly data champion'
    ]
  },
  {
    id: 'HH-003',
    name: 'Fernandez Residence',
    location: 'Whitefield, Bengaluru',
    members: 5,
    goalLiters: 22000,
    lastUpdated: '2025-09-21',
    savings: {
      weekly: 510,
      monthly: 2120,
      yearly: 19840
    },
    monthlyBreakdown: [
      { month: 'Jan', liters: 1680 },
      { month: 'Feb', liters: 1720 },
      { month: 'Mar', liters: 1760 },
      { month: 'Apr', liters: 1880 },
      { month: 'May', liters: 2100 },
      { month: 'Jun', liters: 2060 },
      { month: 'Jul', liters: 1980 },
      { month: 'Aug', liters: 2020 },
      { month: 'Sep', liters: 2140 },
      { month: 'Oct', liters: 2060 },
      { month: 'Nov', liters: 1920 },
      { month: 'Dec', liters: 1940 }
    ],
    achievements: [
      'Installed drip irrigation system',
      'Hosted community awareness meetup'
    ]
  },
  {
    id: 'HH-004',
    name: 'Iqbal Family',
    location: 'Jayanagar, Bengaluru',
    members: 6,
    goalLiters: 24000,
    lastUpdated: '2025-09-24',
    savings: {
      weekly: 540,
      monthly: 2240,
      yearly: 20560
    },
    monthlyBreakdown: [
      { month: 'Jan', liters: 1640 },
      { month: 'Feb', liters: 1700 },
      { month: 'Mar', liters: 1820 },
      { month: 'Apr', liters: 1900 },
      { month: 'May', liters: 2140 },
      { month: 'Jun', liters: 2180 },
      { month: 'Jul', liters: 2100 },
      { month: 'Aug', liters: 2060 },
      { month: 'Sep', liters: 2220 },
      { month: 'Oct', liters: 2140 },
      { month: 'Nov', liters: 2000 },
      { month: 'Dec', liters: 2000 }
    ],
    achievements: [
      'Zero runoff pledge achiever',
      'Greywater recycling ambassador'
    ]
  },
  {
    id: 'HH-005',
    name: 'Kulkarni Residence',
    location: 'Koramangala, Bengaluru',
    members: 2,
    goalLiters: 12000,
    lastUpdated: '2025-09-20',
    savings: {
      weekly: 280,
      monthly: 1180,
      yearly: 10120
    },
    monthlyBreakdown: [
      { month: 'Jan', liters: 860 },
      { month: 'Feb', liters: 920 },
      { month: 'Mar', liters: 980 },
      { month: 'Apr', liters: 1040 },
      { month: 'May', liters: 1160 },
      { month: 'Jun', liters: 1200 },
      { month: 'Jul', liters: 1120 },
      { month: 'Aug', liters: 1080 },
      { month: 'Sep', liters: 1180 },
      { month: 'Oct', liters: 1100 },
      { month: 'Nov', liters: 1020 },
      { month: 'Dec', liters: 1060 }
    ],
    achievements: [
      'DIY rain gauge creator',
      'Zero single-use plastic events'
    ]
  },
  {
    id: 'HH-006',
    name: 'Rao Family',
    location: 'BTM Layout, Bengaluru',
    members: 4,
    goalLiters: 16000,
    lastUpdated: '2025-09-19',
    savings: {
      weekly: 310,
      monthly: 1360,
      yearly: 12340
    },
    monthlyBreakdown: [
      { month: 'Jan', liters: 940 },
      { month: 'Feb', liters: 980 },
      { month: 'Mar', liters: 1100 },
      { month: 'Apr', liters: 1220 },
      { month: 'May', liters: 1340 },
      { month: 'Jun', liters: 1360 },
      { month: 'Jul', liters: 1300 },
      { month: 'Aug', liters: 1280 },
      { month: 'Sep', liters: 1380 },
      { month: 'Oct', liters: 1320 },
      { month: 'Nov', liters: 1200 },
      { month: 'Dec', liters: 1220 }
    ],
    achievements: [
      'Community clean water volunteer',
      'Placed second in conservation quiz'
    ]
  }
];

const perks = [
  {
    threshold: 1000,
    title: 'Bronze Saver',
    description: '5% discount on Physics Wallah courses',
    color: 'from-sky-400 to-sky-600'
  },
  {
    threshold: 2000,
    title: 'Silver Saver',
    description: '10% discount on Physics Wallah courses',
    color: 'from-blue-500 to-blue-700'
  },
  {
    threshold: 5000,
    title: 'Gold Champion',
    description: 'Free Physics Wallah workshop coupon',
    color: 'from-emerald-500 to-emerald-700'
  }
];

const formatLiters = (value: number) =>
  `${new Intl.NumberFormat('en-IN').format(Math.round(value))} L`;

const formatDate = (dateValue: string) => {
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    return dateValue;
  }
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium'
  }).format(parsed);
};

const getProgress = (value: number, goal: number) => {
  if (!goal) return 0;
  return Math.min(Math.round((value / goal) * 100), 100);
};

const timeframeLabels: Record<Timeframe, string> = {
  weekly: 'This Week',
  monthly: 'This Month',
  yearly: 'This Year'
};

const useWidthRef = (percent: number) => {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (barRef.current) {
      const safePercent = Number.isFinite(percent)
        ? Math.min(Math.max(percent, 0), 100)
        : 0;
      barRef.current.style.width = `${safePercent}%`;
    }
  }, [percent]);
  return barRef;
};

interface ProgressProps {
  value: number;
  trackClassName?: string;
  barClassName?: string;
  className?: string;
}

const ProgressBar: React.FC<ProgressProps> = ({
  value,
  trackClassName = 'bg-blue-100',
  barClassName = 'bg-blue-500',
  className = ''
}) => {
  const barRef = useWidthRef(value);
  return (
    <div className={`h-3 rounded-full overflow-hidden ${trackClassName} ${className}`}>
      <div ref={barRef} className={`h-full ${barClassName}`} />
    </div>
  );
};

const useHeightRef = (percent: number, minimum = 8) => {
  const columnRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (columnRef.current) {
      const safePercent = Number.isFinite(percent)
        ? Math.min(Math.max(percent, minimum), 100)
        : minimum;
      columnRef.current.style.height = `${safePercent}%`;
    }
  }, [percent, minimum]);
  return columnRef;
};

const SparkColumn: React.FC<{ percent: number }> = ({ percent }) => {
  const columnRef = useHeightRef(percent);
  return (
    <div
      ref={columnRef}
      className="w-6 rounded-t-full bg-gradient-to-t from-blue-500 via-sky-500 to-cyan-300"
    />
  );
};

const Community: React.FC = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>('weekly');
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>(families[0]?.id ?? '');

  const leaderboard = useMemo(() => {
    return [...families].sort(
      (a, b) => b.savings[timeframe] - a.savings[timeframe]
    );
  }, [timeframe]);

  const communityTotals = useMemo(() => {
    return families.reduce(
      (acc, family) => {
        acc[timeframe] += family.savings[timeframe];
        acc.yearly += family.savings.yearly;
        acc.goal += family.goalLiters;
        return acc;
      },
      { weekly: 0, monthly: 0, yearly: 0, goal: 0 } as {
        weekly: number;
        monthly: number;
        yearly: number;
        goal: number;
      }
    );
  }, [timeframe]);

  const selectedFamily = families.find((family) => family.id === selectedFamilyId) ?? families[0];
  const maxMonthlyValue = selectedFamily
    ? Math.max(...selectedFamily.monthlyBreakdown.map((m) => m.liters))
    : 0;

  return (
    <MainLayout>
      <div className="space-y-8">
        <header className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">Community Water Impact</h1>
            <p className="text-gray-600">
              Track household savings, celebrate top performers, and unlock exclusive rewards together.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <DropletIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Saved {timeframeLabels[timeframe].toLowerCase()}</p>
                <p className="text-xl font-semibold text-gray-800">{formatLiters(communityTotals[timeframe])}</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <TrendingUpIcon className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Average Household Progress</p>
                <p className="text-xl font-semibold text-gray-800">
                  {Math.round(
                    communityTotals.goal
                      ? (communityTotals.yearly / communityTotals.goal) * 100
                      : 0
                  )}
                  %
                </p>
              </div>
            </Card>
            <Card className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <UsersIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Households</p>
                <p className="text-xl font-semibold text-gray-800">{families.length}</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <BarChart2Icon className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Top Goal Completion</p>
                <p className="text-xl font-semibold text-gray-800">
                  {getProgress(leaderboard[0]?.savings.yearly ?? 0, leaderboard[0]?.goalLiters ?? 1)}%
                </p>
              </div>
            </Card>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <Card className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Water Saved Dashboard</h2>
                  <p className="text-gray-500 text-sm">
                    Explore household water savings with live progress and recent updates.
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 p-1 rounded-full">
                  {(Object.keys(timeframeLabels) as Timeframe[]).map((option) => (
                    <button
                      key={option}
                      onClick={() => setTimeframe(option)}
                      className={`px-3 py-1 text-sm font-medium rounded-full transition ${
                        timeframe === option
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-blue-600 hover:bg-blue-100'
                      }`}
                    >
                      {timeframeLabels[option]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {families.map((family) => {
                  const progress = getProgress(family.savings.yearly, family.goalLiters);
                  const isSelected = family.id === selectedFamily?.id;
                  return (
                    <div
                      key={family.id}
                      className={`border rounded-2xl p-4 transition shadow-sm bg-white/70 backdrop-blur-sm hover:shadow-md cursor-pointer ${
                        isSelected ? 'border-blue-500 ring-1 ring-blue-200' : 'border-transparent'
                      }`}
                      onClick={() => setSelectedFamilyId(family.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-400">{family.id}</p>
                          <h3 className="text-lg font-semibold text-gray-800">{family.name}</h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
                            Updated {formatDate(family.lastUpdated)}
                          </p>
                        </div>
                        <div className="shrink-0">
                          <div className="relative h-12 w-10">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-blue-200 to-blue-500 opacity-90" />
                            <DropletIcon className="relative z-10 h-full w-full text-white p-1" />
                          </div>
                          <p className="text-xs text-center text-gray-500 mt-1">{progress}% goal</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-baseline justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Saved {timeframeLabels[timeframe].toLowerCase()}</p>
                          <p className="text-xl font-semibold text-gray-800">
                            {formatLiters(family.savings[timeframe])}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Annual target</p>
                          <p className="text-sm font-medium text-gray-600">{formatLiters(family.goalLiters)}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <ProgressBar
                          value={progress}
                          trackClassName="bg-blue-100"
                          barClassName="rounded-full bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-400"
                        />
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                          <UsersIcon className="h-3.5 w-3.5 text-blue-500" />
                          <span>{family.members} members actively conserving</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="space-y-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold text-gray-800">Leaderboard</h2>
                <p className="text-sm text-gray-500">
                  Celebrate the top savers. Filter rankings by timeframe to compare performance.
                </p>
              </div>
              <div className="space-y-3">
                {leaderboard.map((family, index) => {
                  const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : null;
                  return (
                    <div
                      key={family.id}
                      className={`flex items-center gap-4 rounded-2xl p-4 border transition ${
                        index < 3 ? 'bg-blue-50 border-blue-100' : 'border-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-white shadow-sm">
                        {medal ? (
                          <span className="text-2xl" aria-hidden="true">
                            {medal}
                          </span>
                        ) : (
                          <AwardIcon className="h-6 w-6 text-blue-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{family.name}</p>
                        <p className="text-xs text-gray-500 uppercase">{family.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{timeframeLabels[timeframe]}</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {formatLiters(family.savings[timeframe])}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Perks & Milestones</h2>
                  <p className="text-sm text-gray-500">
                    Rewards unlocked for <span className="font-semibold">{selectedFamily?.name}</span> based on yearly savings.
                  </p>
                </div>
                <TrophyIcon className="h-6 w-6 text-amber-500" />
              </div>
              <div className="space-y-3">
                {perks.map((perk) => {
                  const unlocked = (selectedFamily?.savings.yearly ?? 0) >= perk.threshold;
                  const progress = Math.min(
                    100,
                    Math.round(
                      ((selectedFamily?.savings.yearly ?? 0) / perk.threshold) * 100
                    )
                  );
                  return (
                    <div
                      key={perk.threshold}
                      className={`relative overflow-hidden rounded-2xl border ${
                        unlocked ? 'border-emerald-200 bg-emerald-50' : 'border-gray-100 bg-white'
                      }`}
                    >
                      <div className="p-4 flex items-start gap-3">
                        <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${perk.color} flex items-center justify-center text-white shadow-inner`}>
                          <GiftIcon className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-800">{perk.title}</p>
                          <p className="text-sm text-gray-500">{perk.description}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <DropletIcon className="h-3.5 w-3.5 text-blue-500" />
                            <span>Requires {formatLiters(perk.threshold)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 pb-4">
                        <ProgressBar
                          value={progress}
                          trackClassName="bg-gray-100"
                          barClassName={`${unlocked ? 'bg-emerald-500' : 'bg-blue-400'} rounded-full`}
                          className="h-2"
                        />
                        <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                          <span>{progress}%</span>
                          <span>
                            {unlocked ? 'Unlocked!' : `${formatLiters(Math.max(perk.threshold - (selectedFamily?.savings.yearly ?? 0), 0))} to go`}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {selectedFamily && (
              <Card className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Family Profile</h2>
                    <p className="text-sm text-gray-500">Detailed insights for the selected household.</p>
                  </div>
                  <MedalIcon className="h-6 w-6 text-blue-500" />
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <DropletIcon className="h-4 w-4 text-blue-500" />
                      <p className="font-semibold text-gray-800">{selectedFamily.name}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <UsersIcon className="h-3.5 w-3.5 text-purple-500" />
                        {selectedFamily.members} members
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3.5 w-3.5 text-emerald-500" />
                        Updated {formatDate(selectedFamily.lastUpdated)}
                      </span>
                    </div>
                    <p className="flex items-center gap-1 text-sm text-gray-500">
                      <UsersIcon className="h-3.5 w-3.5 text-gray-400" />
                      {selectedFamily.location}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-blue-50 p-3">
                      <p className="text-xs text-blue-600">Yearly Savings</p>
                      <p className="text-lg font-semibold text-blue-700">
                        {formatLiters(selectedFamily.savings.yearly)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-3">
                      <p className="text-xs text-emerald-600">Goal Completion</p>
                      <p className="text-lg font-semibold text-emerald-700">
                        {getProgress(selectedFamily.savings.yearly, selectedFamily.goalLiters)}%
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Monthly Savings Trend</h3>
                    <div className="h-32 flex items-end gap-2">
                      {selectedFamily.monthlyBreakdown.map((month) => {
                        const heightPercent = maxMonthlyValue
                          ? (month.liters / maxMonthlyValue) * 100
                          : 0;
                        return (
                          <div key={month.month} className="flex flex-col items-center gap-1">
                            <SparkColumn percent={heightPercent} />
                            <span className="text-xs text-gray-500">{month.month}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Highlights</h3>
                    <ul className="space-y-2">
                      {selectedFamily.achievements.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="mt-1 text-blue-500">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Community;