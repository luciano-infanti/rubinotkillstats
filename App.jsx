
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Upload, TrendingUp, Target, Calendar, Award, RefreshCw } from 'lucide-react';

const BossTrackerDashboard = () => {
  const [rawData, setRawData] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Fetch data from API on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/boss-data');
      const data = await response.json();
      if (data.data) {
        setRawData(data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseData = (text) => {
    const lines = text.split('\n');
    const bosses = [];
    let currentBoss = {};
    let metadata = {
      lastUpdated: '',
      totalBosses: 0,
      killedToday: 0
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.includes('Last Updated:')) {
        metadata.lastUpdated = line.split('Last Updated:')[1].trim();
      } else if (line.includes('Total Bosses Tracked:')) {
        metadata.totalBosses = parseInt(line.split(':')[1].trim());
      } else if (line.includes('Bosses Killed Today:')) {
        metadata.killedToday = parseInt(line.split(':')[1].trim());
      } else if (line.startsWith('Boss:')) {
        if (currentBoss.name) {
          bosses.push({ ...currentBoss });
        }
        currentBoss = {
          name: line.replace('Boss:', '').trim(),
          status: 'Not Killed',
          killedToday: false,
          todayKills: 0,
          totalDaysSpawned: 0,
          totalKills: 0,
          avgDaysBetweenSpawns: 'N/A',
          nextExpectedSpawn: 'N/A',
          lastKillDate: 'Never',
          history: []
        };
      } else if (line.startsWith('Status:') && line.includes('KILLED TODAY')) {
        currentBoss.killedToday = true;
        const killsMatch = line.match(/\((\d+) kills\)/);
        currentBoss.todayKills = killsMatch ? parseInt(killsMatch[1]) : 0;
        currentBoss.status = 'Killed Today';
      } else if (line.startsWith('Total Days Spawned:')) {
        currentBoss.totalDaysSpawned = parseInt(line.split(':')[1].trim());
      } else if (line.startsWith('Total Kills:')) {
        currentBoss.totalKills = parseInt(line.split(':')[1].trim());
      } else if (line.startsWith('Average Days Between Spawns:')) {
        const value = line.split(':')[1].trim();
        currentBoss.avgDaysBetweenSpawns = value.includes('N/A') ? 'N/A' : value;
      } else if (line.startsWith('Next Expected Spawn:')) {
        currentBoss.nextExpectedSpawn = line.split(':')[1].trim();
      } else if (line.startsWith('Last Kill Date:')) {
        currentBoss.lastKillDate = line.split(':')[1].trim();
      } else if (line.startsWith('History:')) {
        const historyText = line.split(':')[1].trim();
        if (historyText !== 'None') {
          currentBoss.history = historyText;
        }
      } else if (line === '---' && currentBoss.name) {
        bosses.push({ ...currentBoss });
        currentBoss = {};
      }
    }

    if (currentBoss.name) {
      bosses.push(currentBoss);
    }

    return { bosses, metadata };
  };

  const { bosses, metadata } = useMemo(() => parseData(rawData), [rawData]);

  const filteredAndSortedBosses = useMemo(() => {
    let filtered = bosses.filter(boss => {
      const matchesSearch = boss.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = 
        filterStatus === 'all' ? true :
        filterStatus === 'killed' ? boss.killedToday :
        filterStatus === 'active' ? boss.totalKills > 0 :
        filterStatus === 'never' ? boss.totalKills === 0 : true;
      
      return matchesSearch && matchesFilter;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'kills':
          return b.totalKills - a.totalKills;
        case 'spawns':
          return b.totalDaysSpawned - a.totalDaysSpawned;
        case 'recent':
          if (a.lastKillDate === 'Never') return 1;
          if (b.lastKillDate === 'Never') return -1;
          return b.lastKillDate.localeCompare(a.lastKillDate);
        default:
          return 0;
      }
    });

    return filtered;
  }, [bosses, searchTerm, filterStatus, sortBy]);

  const stats = useMemo(() => {
    const activeBosses = bosses.filter(b => b.totalKills > 0).length;
    const totalKills = bosses.reduce((sum, b) => sum + b.totalKills, 0);
    const avgKills = activeBosses > 0 ? (totalKills / activeBosses).toFixed(1) : 0;
    const bossesWithSpawns = bosses.filter(b => b.nextExpectedSpawn !== 'N/A');

    return {
      activeBosses,
      totalKills,
      avgKills,
      expectedSpawns: bossesWithSpawns.length
    };
  }, [bosses]);

  const handleDataUpdate = async (e) => {
    e.preventDefault();
    const textarea = e.target.elements.dataInput;
    const newData = textarea.value.trim();
    
    if (!newData) return;

    setSaving(true);
    try {
      const response = await fetch('/api/boss-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: newData }),
      });

      if (response.ok) {
        setRawData(newData);
        setActiveTab('dashboard');
      } else {
        alert('Error saving data. Please try again.');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading boss data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">RubinOT Boss Tracker</h1>
              <p className="text-sm text-gray-500 mt-1">Lunarian Server • {metadata.lastUpdated}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'upload'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Update Data
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Killed Today</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{metadata.killedToday}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Active Bosses</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeBosses}</p>
                    <p className="text-xs text-gray-400 mt-1">of {metadata.totalBosses} total</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Total Kills</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalKills}</p>
                    <p className="text-xs text-gray-400 mt-1">avg {stats.avgKills} per boss</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Expected Spawns</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.expectedSpawns}</p>
                    <p className="text-xs text-gray-400 mt-1">tracked patterns</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search bosses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Bosses</option>
                    <option value="killed">Killed Today</option>
                    <option value="active">Active (Killed Before)</option>
                    <option value="never">Never Killed</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="kills">Sort by Kills</option>
                    <option value="spawns">Sort by Spawns</option>
                    <option value="recent">Sort by Recent</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Boss Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Total Kills</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Days Spawned</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Last Kill</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Next Spawn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedBosses.map((boss, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{boss.name}</div>
                          {boss.history && (
                            <div className="text-xs text-gray-500 mt-1">{boss.history}</div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {boss.killedToday ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ✓ Killed ({boss.todayKills}x)
                            </span>
                          ) : boss.totalKills > 0 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-semibold text-gray-900">{boss.totalKills}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-gray-700">{boss.totalDaysSpawned}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-sm ${boss.lastKillDate === 'Never' ? 'text-gray-400' : 'text-gray-700'}`}>
                            {boss.lastKillDate}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-sm ${boss.nextExpectedSpawn === 'N/A' ? 'text-gray-400' : 'text-gray-700'}`}>
                            {boss.nextExpectedSpawn}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredAndSortedBosses.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No bosses found matching your criteria</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'upload' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Update Boss Data</h2>
                <p className="text-gray-600">Paste your updated boss tracker data below to refresh the dashboard</p>
              </div>

              <form onSubmit={handleDataUpdate}>
                <textarea
                  name="dataInput"
                  rows="20"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Paste your boss tracker data here..."
                  defaultValue={rawData}
                />
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('dashboard')}
                    className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Update Dashboard'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BossTrackerDashboard;
