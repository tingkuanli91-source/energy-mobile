import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// 增強模擬數據
const mockData = {
  currentLoad: 12.4,
  yesterdayChange: -12,
  todayCost: 4.20,
  costChange: -5,
  carbon: 1.2,
  carbonChange: 2,
  efficiency: 92,
  efficiencyChange: -1,
  devices: [
    { id: 1, name: '主電網', status: '在線', statusClass: 'online', icon: 'grid_view', detail: '穩定度：高', voltage: 380, current: 32.6, power: 12.4 },
    { id: 2, name: '太陽能板', status: '運行中', statusClass: 'running', icon: 'wb_sunny', detail: '正在發電 3.2 kW', voltage: 220, current: 14.5, power: 3.2 },
    { id: 3, name: '空調系統', status: '運行中', statusClass: 'running', icon: 'ac_unit', detail: '冷房設定 22°C', voltage: 220, current: 8.2, power: 1.8 },
    { id: 4, name: '充電樁', status: '待機中', statusClass: 'standby', icon: 'ev_station', detail: '最後使用於 2小時前', voltage: 220, current: 0, power: 0 },
    { id: 5, name: '照明系統', status: '運行中', statusClass: 'running', icon: 'lightbulb', detail: '亮度 80%', voltage: 110, current: 2.5, power: 0.28 },
    { id: 6, name: 'UPS 不斷電', status: '在線', statusClass: 'online', icon: 'battery_charging_full', detail: '電量 95%', voltage: 48, current: 5, power: 0.24 },
  ],
  chartData: Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    value: Math.round(15 + Math.random() * 35)
  })),
  weeklyData: [
    { day: '週一', value: 285 },
    { day: '週二', value: 312 },
    { day: '週三', value: 298 },
    { day: '週四', value: 345 },
    { day: '週五', value: 320 },
    { day: '週六', value: 256 },
    { day: '週日', value: 234 },
  ],
  savings: 1240.50,
  savingsChange: 15.2,
  points: 4850,
  carbonSaved: 2.4,
  trees: 48,
  monthlyData: [40, 60, 55, 80, 95, 70, 85, 92, 78, 88, 72, 68],
  hourlyData: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    usage: Math.round(0.5 + Math.random() * 2.5 * 10) / 10
  })),
  deviceBreakdown: [
    { name: '空調', value: 40, color: '#0f49bd' },
    { name: '照明', value: 20, color: '#3b82f6' },
    { name: '設備', value: 25, color: '#60a5fa' },
    { name: '其他', value: 15, color: '#93c5fd' },
  ],
  historyData: [
    { date: '2026-02-24', usage: 285, cost: 39.90 },
    { date: '2026-02-25', usage: 312, cost: 43.68 },
    { date: '2026-02-26', usage: 298, cost: 41.72 },
    { date: '2026-02-27', usage: 345, cost: 48.30 },
    { date: '2026-02-28', usage: 320, cost: 44.80 },
  ],
  user: {
    name: 'Alex Johnson',
    email: 'alex.johnson@ems-energy.com',
    avatar: null,
  },
  notifications: {
    usageAlert: true,
    anomalyAlert: true,
    monthlyReport: false,
  },
  energyRates: {
    currency: 'USD',
    rate: 0.14,
    currencySymbol: '$',
  },
};

// Dashboard 頁面 - 第 1 輪優化
const Dashboard = ({ onNavigate }) => {
  const [realTimeData, setRealTimeData] = useState(mockData);
  const [selectedDevice, setSelectedDevice] = useState(null);

  // 模擬即時數據更新
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        currentLoad: Math.round((12 + Math.random() * 2) * 10) / 10,
        efficiency: Math.round(90 + Math.random() * 8),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page">
      <header className="header">
        <div className="user-info">
          <div className="avatar">
            <span className="material-symbols-outlined">account_circle</span>
          </div>
          <div>
            <p className="greeting">歡迎回來</p>
            <h2 className="user-name">早安</h2>
          </div>
        </div>
        <button className="notification-btn">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      <section className="energy-display">
        <span className="energy-label">當前總負載</span>
        <div className="energy-value">
          <h1>{realTimeData.currentLoad.toFixed(1)}</h1>
          <span className="unit">kW</span>
        </div>
        <div className="trend">
          <span className="material-symbols-outlined">trending_down</span>
          <span>比昨日減少 {Math.abs(realTimeData.yesterdayChange)}%</span>
        </div>
      </section>

      <section className="metrics-grid">
        <div className="metric-card">
          <span className="material-symbols-outlined metric-icon">payments</span>
          <p className="metric-label">今日總支出</p>
          <p className="metric-value">${realTimeData.todayCost.toFixed(2)}</p>
          <span className="metric-change negative">{realTimeData.costChange}%</span>
        </div>
        <div className="metric-card">
          <span className="material-symbols-outlined metric-icon eco">eco</span>
          <p className="metric-label">碳足跡</p>
          <p className="metric-value">{realTimeData.carbon}kg</p>
          <span className="metric-change positive">+{realTimeData.carbonChange}%</span>
        </div>
        <div className="metric-card">
          <span className="material-symbols-outlined metric-icon amber">bolt</span>
          <p className="metric-label">系統效率</p>
          <p className="metric-value">{realTimeData.efficiency}%</p>
          <span className="metric-change negative">{realTimeData.efficiencyChange}%</span>
        </div>
      </section>

      <section className="chart-section">
        <div className="chart-header">
          <h3>即時能耗 (24小時)</h3>
          <div className="live-indicator">
            <span className="pulse"></span>
            <span>實時</span>
          </div>
        </div>
        <div className="chart-container interactive">
          {realTimeData.chartData.slice(0, 12).map((point, i) => (
            <div key={i} className="chart-bar-wrapper">
              <div 
                className="chart-bar" 
                style={{ height: `${(point.value / 50) * 100}%` }}
                title={`${point.time}: ${point.value} kW`}
              ></div>
            </div>
          ))}
        </div>
        <div className="chart-labels">
          <span>08:00</span>
          <span>10:00</span>
          <span>12:00</span>
          <span>14:00</span>
        </div>
      </section>

      <section className="devices-section">
        <div className="section-header">
          <h3>設備狀態</h3>
          <button className="view-all">查看全部</button>
        </div>
        <div className="devices-list">
          {realTimeData.devices.slice(0, 4).map(device => (
            <div 
              key={device.id} 
              className="device-item clickable"
              onClick={() => setSelectedDevice(selectedDevice?.id === device.id ? null : device)}
            >
              <div className="device-icon">
                <span className="material-symbols-outlined">{device.icon}</span>
              </div>
              <div className="device-info">
                <p className="device-name">{device.name}</p>
                <p className="device-detail">{device.detail}</p>
              </div>
              <span className={`device-status ${device.statusClass}`}>{device.status}</span>
            </div>
          ))}
        </div>
        
        {selectedDevice && (
          <div className="device-detail-modal">
            <div className="modal-header">
              <h3>{selectedDevice.name}</h3>
              <button onClick={() => setSelectedDevice(null)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="modal-content">
              <div className="detail-row">
                <span>狀態</span>
                <span className={`status ${selectedDevice.statusClass}`}>{selectedDevice.status}</span>
              </div>
              <div className="detail-row">
                <span>電壓</span>
                <span>{selectedDevice.voltage} V</span>
              </div>
              <div className="detail-row">
                <span>電流</span>
                <span>{selectedDevice.current} A</span>
              </div>
              <div className="detail-row">
                <span>功率</span>
                <span>{selectedDevice.power} kW</span>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

// 數據分析頁面
const Analysis = ({ onNavigate }) => {
  const [timeRange, setTimeRange] = useState('日');
  const [showTable, setShowTable] = useState(false);

  const getFilteredData = () => {
    switch (timeRange) {
      case '日': return mockData.hourlyData;
      case '週': return mockData.weeklyData;
      case '月': return mockData.monthlyData.map((v, i) => ({ month: i + 1, value: v * 10 }));
      case '年': return Array.from({ length: 12 }, (_, i) => ({ month: i + 1, value: Math.round(2500 + Math.random() * 1500) }));
      default: return mockData.hourlyData;
    }
  };

  const handleExport = (format) => {
    const data = mockData.historyData;
    let content = '';
    let filename = `energy_data_${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'csv') {
      content = 'Date,Usage (kWh),Cost (USD)\n' + data.map(d => `${d.date},${d.usage},${d.cost}`).join('\n');
      filename += '.csv';
    } else if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      filename += '.json';
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page">
      <header className="header">
        <button className="back-btn">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1>數據分析</h1>
        <button className="share-btn" onClick={() => handleExport('csv')}>
          <span className="material-symbols-outlined">download</span>
        </button>
      </header>

      <div className="time-selector">
        {['日', '週', '月', '年'].map(t => (
          <label key={t} className={timeRange === t ? 'active' : ''}>
            <input type="radio" name="time" checked={timeRange === t} onChange={() => setTimeRange(t)} />
            <span>{t}</span>
          </label>
        ))}
      </div>

      <section className="main-chart">
        <div className="chart-header">
          <div>
            <p className="chart-label">總能源消耗</p>
            <h2 className="chart-value">
              {timeRange === '日' ? '12.4 ' : timeRange === '週' ? '2,150 ' : timeRange === '月' ? '28,450 ' : '312,500 '}
              <span>kWh</span>
            </h2>
          </div>
          <div className="chart-trend positive">
            <span className="material-symbols-outlined">trending_down</span>
            5.2%
          </div>
        </div>
        <div className="chart-container large interactive">
          {getFilteredData().slice(0, 12).map((point, i) => (
            <div key={i} className="chart-bar-wrapper large">
              <div 
                className="chart-bar large" 
                style={{ 
                  height: `${(point.value / (timeRange === '年' ? 5000 : 100)) * 100}%`,
                  background: `hsl(220, 70%, ${50 + (i % 3) * 10}%)`
                }}
              ></div>
            </div>
          ))}
        </div>
        <div className="chart-labels">
          <span>第1點</span>
          <span>第3點</span>
          <span>第6點</span>
          <span>第9點</span>
        </div>
      </section>

      <div className="action-buttons">
        <button className="action-btn" onClick={() => setShowTable(!showTable)}>
          <span className="material-symbols-outlined">table_chart</span>
          詳細數據
        </button>
        <button className="action-btn" onClick={() => handleExport('csv')}>
          <span className="material-symbols-outlined">file_download</span>
          匯出 CSV
        </button>
      </div>

      {showTable && (
        <section className="data-table">
          <table>
            <thead>
              <tr><th>日期</th><th>用電量</th><th>費用</th></tr>
            </thead>
            <tbody>
              {mockData.historyData.map((row, i) => (
                <tr key={i}><td>{row.date}</td><td>{row.usage} kWh</td><td>${row.cost.toFixed(2)}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <div className="two-col">
        <section className="breakdown">
          <h3>設備分類用電</h3>
          <div className="donut-chart">
            <svg viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#e2e8f0" strokeWidth="3.8" />
              {mockData.deviceBreakdown.map((item, i, arr) => {
                const offset = arr.slice(0, i).reduce((sum, a) => sum + a.value, 0);
                return (
                  <circle key={item.name} cx="18" cy="18" r="15.9" fill="transparent" stroke={item.color} strokeDasharray={`${item.value} 100`} strokeDashoffset={-offset} strokeWidth="4.2" />
                );
              })}
            </svg>
            <div className="donut-center"><span className="donut-total">100%</span></div>
          </div>
          <div className="breakdown-list">
            {mockData.deviceBreakdown.map(item => (
              <div key={item.name} className="breakdown-item"><span className="dot" style={{background: item.color}}></span>{item.name} {item.value}%</div>
            ))}
          </div>
        </section>

        <section className="comparison">
          <h3>比較分析</h3>
          <div className="comparison-item">
            <div className="comp-label"><span>本月</span><span>452.8 kWh</span></div>
            <div className="comp-bar"><div style={{width: '75%'}}></div></div>
          </div>
          <div className="comparison-item">
            <div className="comp-label"><span>上個月</span><span>477.1 kWh</span></div>
            <div className="comp-bar"><div style={{width: '80%'}}></div></div>
          </div>
          <div className="benefit-badge">
            <span className="material-symbols-outlined">auto_graph</span>
            <p>效益分析</p>
            <p className="benefit-value">+12.4% 優於平均</p>
          </div>
        </section>
      </div>
    </div>
  );
};

// 效益分析頁面
const Benefits = ({ onNavigate }) => {
  const [showRedeem, setShowRedeem] = useState(false);

  const redeemOptions = [
    { id: 1, name: '亞馬遜禮券 $10', points: 1000, icon: 'card_giftcard' },
    { id: 2, name: '星巴克咖啡', points: 500, icon: 'coffee' },
    { id: 3, name: '植物種植', points: 300, icon: 'grass' },
    { id: 4, name: '慈善捐款 $5', points: 800, icon: 'volunteer_activism' },
  ];

  const handleRedeem = (option) => {
    if (mockData.points >= option.points) {
      alert(`成功兌換 ${option.name}！\n扣除 ${option.points} 點`);
      setShowRedeem(false);
    } else {
      alert('點數不足！');
    }
  };

  return (
    <div className="page">
      <header className="header">
        <div className="user-info">
          <button className="back-btn"><span className="material-symbols-outlined">arrow_back</span></button>
          <h1>效益分析</h1>
        </div>
        <button className="settings-btn"><span className="material-symbols-outlined">share</span></button>
      </header>

      <section className="savings-hero">
        <p className="savings-label">今年總節省</p>
        <div className="savings-value">
          <h2>${mockData.savings.toFixed(2)}</h2>
          <span className="savings-trend positive"><span className="material-symbols-outlined">trending_up</span>+{mockData.savingsChange}%</span>
        </div>
      </section>

      <section className="env-impact">
        <h3>環境影響</h3>
        <div className="env-grid">
          <div className="env-card interactive" onClick={() => alert(`二氧化碳減排量：${mockData.carbonSaved} 公噸`)}>
            <span className="material-symbols-outlined eco">co2</span>
            <p className="env-value">{mockData.carbonSaved} 公噸</p>
            <p className="env-label">二氧化碳減排量</p>
          </div>
          <div className="env-card interactive" onClick={() => alert(`等效種植：${mockData.trees} 棵樹`)}>
            <span className="material-symbols-outlined primary">forest</span>
            <p className="env-value">{mockData.trees} 棵</p>
            <p className="env-label">等效樹林量</p>
          </div>
        </div>
      </section>

      <section className="points-section">
        <div className="points-card">
          <div className="points-icon"><span className="material-symbols-outlined fill">toll</span></div>
          <div className="points-info">
            <p className="points-label">能源點數</p>
            <p className="points-value">{mockData.points.toLocaleString()} <span>點</span></p>
          </div>
          <button className="redeem-btn" onClick={() => setShowRedeem(!showRedeem)}>{showRedeem ? '關閉' : '兌換'}</button>
        </div>
      </section>

      {showRedeem && (
        <section className="redeem-modal">
          <h3>兌換選項</h3>
          <div className="redeem-list">
            {redeemOptions.map(option => (
              <div key={option.id} className="redeem-item" onClick={() => handleRedeem(option)}>
                <span className="material-symbols-outlined">{option.icon}</span>
                <div className="redeem-info">
                  <p className="redeem-name">{option.name}</p>
                  <p className="redeem-points">{option.points} 點</p>
                </div>
                <span className="material-symbols-outlined">chevron_right</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="monthly-savings">
        <h3>每月節省金額</h3>
        <div className="bar-chart">
          {mockData.monthlyData.map((v, i) => (
            <div key={i} className="bar-item"><div className="bar" style={{height: `${(v / 100) * 100}%`}}></div><span>{i+1}月</span></div>
          ))}
        </div>
        <p className="avg-savings">平均每月節省: <span>$206.75</span></p>
      </section>

      <section className="initiatives">
        <h3>參與中的計畫</h3>
        <div className="initiative-list">
          <div className="initiative-item active">
            <div className="init-icon orange"><span className="material-symbols-outlined">bolt</span></div>
            <div className="init-info"><p className="init-name">尖峰負載反應</p><p className="init-desc">在電網壓力大時減少負載</p></div>
            <span className="init-status">已加入</span>
          </div>
          <div className="initiative-item active">
            <div className="init-icon primary"><span className="material-symbols-outlined">schedule</span></div>
            <div className="init-info"><p className="init-name">智慧排程</p><p className="init-desc">優化家電使用時間</p></div>
            <span className="init-status">已加入</span>
          </div>
          <div className="initiative-item clickable">
            <div className="init-icon"><span className="material-symbols-outlined">solar_power</span></div>
            <div className="init-info"><p className="init-name">社區太陽能</p><p className="init-desc">分享本地再生能源</p></div>
            <span className="init-status">可申請</span>
          </div>
        </div>
      </section>
    </div>
  );
};

// 設定頁面
const Settings = ({ onNavigate }) => {
  const [notifications, setNotifications] = useState(mockData.notifications);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [userData, setUserData] = useState(mockData.user);

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setUserData({ name: formData.get('name'), email: formData.get('email') });
    setShowProfileEdit(false);
    alert('個人資料已更新！');
  };

  return (
    <div className="page">
      <header className="header">
        <button className="back-btn"><span className="material-symbols-outlined">arrow_back</span></button>
        <h1>設定</h1>
      </header>

      <section className="profile-section">
        <div className="profile-avatar large">
          <span className="material-symbols-outlined">account_circle</span>
          <button className="edit-avatar" onClick={() => setShowProfileEdit(true)}><span className="material-symbols-outlined">edit</span></button>
        </div>
        <div className="profile-info">
          <p className="profile-name">{userData.name}</p>
          <p className="profile-email">{userData.email}</p>
        </div>
      </section>

      {showProfileEdit && (
        <section className="edit-modal">
          <form onSubmit={handleProfileSave}>
            <h3>編輯個人資料</h3>
            <div className="form-group"><label>姓名</label><input type="text" name="name" defaultValue={userData.name} /></div>
            <div className="form-group"><label>電子郵件</label><input type="email" name="email" defaultValue={userData.email} /></div>
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => setShowProfileEdit(false)}>取消</button>
              <button type="submit" className="save-btn">儲存</button>
            </div>
          </form>
        </section>
      )}

      <div className="settings-groups">
        <div className="settings-group">
          <h3>帳戶設定</h3>
          <div className="settings-list">
            <div className="setting-item clickable"><span className="material-symbols-outlined primary">person</span><p>個人資料管理</p><span className="material-symbols-outlined chevron">chevron_right</span></div>
            <div className="setting-item clickable"><span className="material-symbols-outlined primary">lock</span><p>密碼與安全性</p><span className="material-symbols-outlined chevron">chevron_right</span></div>
          </div>
        </div>

        <div className="settings-group">
          <h3>通知設定</h3>
          <div className="settings-list">
            <div className="setting-item toggle">
              <div className="setting-info"><span className="material-symbols-outlined primary">notifications_active</span><div><p>用量警示</p><p className="setting-desc">超過每日上限時通知</p></div></div>
              <label className="switch"><input type="checkbox" checked={notifications.usageAlert} onChange={() => handleNotificationChange('usageAlert')} /><span className="slider"></span></label>
            </div>
            <div className="setting-item toggle">
              <div className="setting-info"><span className="material-symbols-outlined primary">warning</span><div><p>異常偵測</p><p className="setting-desc">用電異常時警示</p></div></div>
              <label className="switch"><input type="checkbox" checked={notifications.anomalyAlert} onChange={() => handleNotificationChange('anomalyAlert')} /><span className="slider"></span></label>
            </div>
            <div className="setting-item toggle">
              <div className="setting-info"><span className="material-symbols-outlined primary">article</span><div><p>每月報告推送</p><p className="setting-desc">每月能源使用報告</p></div></div>
              <label className="switch"><input type="checkbox" checked={notifications.monthlyReport} onChange={() => handleNotificationChange('monthlyReport')} /><span className="slider"></span></label>
            </div>
          </div>
        </div>

        <div className="settings-group">
          <h3>設備與系統</h3>
          <div className="settings-list">
            <div className="setting-item clickable"><span className="material-symbols-outlined primary">devices</span><div><p>已連線設備</p><p className="setting-desc">{mockData.devices.length} 個設備在線</p></div><span className="material-symbols-outlined chevron">chevron_right</span></div>
            <div className="setting-item clickable"><span className="material-symbols-outlined primary">payments</span><div><p>能源計費設定</p><p className="setting-desc">{mockData.energyRates.currencySymbol}{mockData.energyRates.rate} per kWh</p></div><span className="material-symbols-outlined chevron">chevron_right</span></div>
            <div className="setting-item clickable"><span className="material-symbols-outlined primary">solar_power</span><div><p>太陽能整合</p><p className="setting-desc">已連線 Tesla Powerwall</p></div><span className="material-symbols-outlined chevron">chevron_right</span></div>
          </div>
        </div>
      </div>

      <button className="logout-btn"><span className="material-symbols-outlined">logout</span>登出</button>
      <p className="version">版本 2.4.1 (Build 890)</p>
    </div>
  );
};

// 主應用
function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', icon: 'grid_view', label: '儀表板' },
    { id: 'analysis', icon: 'analytics', label: '數據分析' },
    { id: 'benefits', icon: 'redeem', label: '效益分析' },
    { id: 'settings', icon: 'settings', label: '設定' },
  ];

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'analysis': return <Analysis />;
      case 'benefits': return <Benefits />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <main className="main-content">{renderPage()}</main>
      <nav className="bottom-nav">
        {tabs.map(tab => (
          <button key={tab.id} className={`nav-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            <span className={`material-symbols-outlined ${activeTab === tab.id ? 'fill' : ''}`}>{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
