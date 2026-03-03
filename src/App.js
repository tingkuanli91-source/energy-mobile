import React, { useState } from 'react';
import './App.css';

// 模擬數據
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
    { id: 1, name: '主電網', status: '在線', statusClass: 'online', icon: 'grid_view', detail: '穩定度：高' },
    { id: 2, name: '太陽能板', status: '運行中', statusClass: 'running', icon: 'wb_sunny', detail: '正在發電 3.2 kW' },
    { id: 3, name: '空調系統', status: '運行中', statusClass: 'running', icon: 'ac_unit', detail: '冷房設定 22°C' },
    { id: 4, name: '充電樁', status: '待機中', statusClass: 'standby', icon: 'ev_station', detail: '最後使用於 2小時前' },
  ],
  chartData: [
    { time: '08:00', value: 20 },
    { time: '09:00', value: 35 },
    { time: '10:00', value: 25 },
    { time: '11:00', value: 45 },
    { time: '12:00', value: 30 },
    { time: '13:00', value: 50 },
    { time: '14:00', value: 40 },
  ],
  savings: 1240.50,
  savingsChange: 15.2,
  points: 4850,
  carbonSaved: 2.4,
  trees: 48,
  monthlyData: [40, 60, 55, 80, 95, 70],
};

// Dashboard 頁面
const Dashboard = ({ onNavigate }) => (
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
        <h1>{mockData.currentLoad}</h1>
        <span className="unit">kW</span>
      </div>
      <div className="trend">
        <span className="material-symbols-outlined">trending_down</span>
        <span>比昨日減少 {Math.abs(mockData.yesterdayChange)}%</span>
      </div>
    </section>

    <section className="metrics-grid">
      <div className="metric-card">
        <span className="material-symbols-outlined metric-icon">payments</span>
        <p className="metric-label">今日總支出</p>
        <p className="metric-value">${mockData.todayCost.toFixed(2)}</p>
        <span className="metric-change negative">{mockData.costChange}%</span>
      </div>
      <div className="metric-card">
        <span className="material-symbols-outlined metric-icon eco">eco</span>
        <p className="metric-label">碳足跡</p>
        <p className="metric-value">{mockData.carbon}kg</p>
        <span className="metric-change positive">+{mockData.carbonChange}%</span>
      </div>
      <div className="metric-card">
        <span className="material-symbols-outlined metric-icon amber">bolt</span>
        <p className="metric-label">系統效率</p>
        <p className="metric-value">{mockData.efficiency}%</p>
        <span className="metric-change negative">{mockData.efficiencyChange}%</span>
      </div>
    </section>

    <section className="chart-section">
      <div className="chart-header">
        <h3>即時能耗</h3>
        <div className="live-indicator">
          <span className="pulse"></span>
          <span>實時數據</span>
        </div>
      </div>
      <div className="chart-container">
        <svg className="chart" viewBox="0 0 400 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(15, 73, 189, 0.3)" />
              <stop offset="100%" stopColor="rgba(15, 73, 189, 0)" />
            </linearGradient>
          </defs>
          <path d="M0,80 Q40,70 80,85 T160,60 T240,75 T320,40 T400,50 L400,100 L0,100 Z" fill="url(#chartGrad)" />
          <path d="M0,80 Q40,70 80,85 T160,60 T240,75 T320,40 T400,50" fill="none" stroke="#0f49bd" strokeWidth="3" />
        </svg>
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
        {mockData.devices.map(device => (
          <div key={device.id} className="device-item">
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
    </section>
  </div>
);

// 數據分析頁面
const Analysis = ({ onNavigate }) => {
  const [timeRange, setTimeRange] = useState('月');
  
  return (
    <div className="page">
      <header className="header">
        <button className="back-btn">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1>數據分析</h1>
        <button className="share-btn">
          <span className="material-symbols-outlined">share</span>
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
            <p className="chart-label">總能源</p>
            <h2 className="chart-value">452.8 <span>kWh</span></h2>
          </div>
          <div className="chart-trend positive">
            <span className="material-symbols-outlined">trending_down</span>
            5.2%
          </div>
        </div>
        <div className="chart-container large">
          <svg viewBox="0 0 400 150" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartFill2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(15, 73, 189, 0.3)" />
                <stop offset="100%" stopColor="rgba(15, 73, 189, 0)" />
              </linearGradient>
            </defs>
            <path d="M0,120 Q50,110 80,60 T160,80 T240,30 T320,70 T400,50 L400,150 L0,150 Z" fill="url(#chartFill2)" />
            <path d="M0,120 Q50,110 80,60 T160,80 T240,30 T320,70 T400,50" fill="none" stroke="#0f49bd" strokeWidth="3" />
            <circle cx="80" cy="60" r="4" fill="#0f49bd" />
            <circle cx="240" cy="30" r="4" fill="#0f49bd" />
          </svg>
        </div>
        <div className="chart-labels">
          <span>第 1 週</span>
          <span>第 2 週</span>
          <span>第 3 週</span>
          <span>第 4 週</span>
        </div>
      </section>

      <div className="two-col">
        <section className="breakdown">
          <h3>設備分類用電</h3>
          <div className="donut-chart">
            <svg viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#e2e8f0" strokeWidth="3.8" />
              <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#0f49bd" strokeDasharray="40 100" strokeDashoffset="0" strokeWidth="4.2" />
              <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#3b82f6" strokeDasharray="25 100" strokeDashoffset="-40" strokeWidth="4.2" />
              <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#60a5fa" strokeDasharray="20 100" strokeDashoffset="-65" strokeWidth="4.2" />
              <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#93c5fd" strokeDasharray="15 100" strokeDashoffset="-85" strokeWidth="4.2" />
            </svg>
            <div className="donut-center">
              <span className="donut-total">100%</span>
            </div>
          </div>
          <div className="breakdown-list">
            <div className="breakdown-item"><span className="dot primary"></span>空調 40%</div>
            <div className="breakdown-item"><span className="dot blue-500"></span>電動車充電 25%</div>
            <div className="breakdown-item"><span className="dot blue-400"></span>家電 20%</div>
            <div className="breakdown-item"><span className="dot blue-300"></span>照明 15%</div>
          </div>
        </section>

        <section className="comparison">
          <h3>比較分析</h3>
          <div className="comparison-item">
            <div className="comp-label"><span>本月</span><span>452.8 kWh</span></div>
            <div className="comp-bar"><div style={{width: '85%'}}></div></div>
          </div>
          <div className="comparison-item">
            <div className="comp-label"><span>上個月</span><span>477.1 kWh</span></div>
            <div className="comp-bar"><div style={{width: '95%'}}></div>
          </div>
          <div className="benefit-badge">
            <span className="material-symbols-outlined">auto_graph</span>
            <div>
              <p>效益分析</p>
              <p className="benefit-value">+12.4% 優於平均</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// 效益分析頁面
const Benefits = ({ onNavigate }) => (
  <div className="page">
    <header className="header">
      <div className="user-info">
        <div className="avatar small">
          <span className="material-symbols-outlined">account_circle</span>
        </div>
        <h1>效益分析</h1>
      </div>
      <button className="settings-btn">
        <span className="material-symbols-outlined">settings</span>
      </button>
    </header>

    <section className="savings-hero">
      <p className="savings-label">今年總節省</p>
      <div className="savings-value">
        <h2>${mockData.savings.toFixed(2)}</h2>
        <span className="savings-trend positive">
          <span className="material-symbols-outlined">trending_up</span>
          +{mockData.savingsChange}%
        </span>
      </div>
    </section>

    <section className="env-impact">
      <h3>環境影響</h3>
      <div className="env-grid">
        <div className="env-card">
          <span className="material-symbols-outlined eco">co2</span>
          <p className="env-value">{mockData.carbonSaved} 公噸</p>
          <p className="env-label">二氧化碳減排量</p>
        </div>
        <div className="env-card">
          <span className="material-symbols-outlined primary">forest</span>
          <p className="env-value">{mockData.trees} 棵</p>
          <p className="env-label">等效樹林量</p>
        </div>
      </div>
    </section>

    <section className="points-section">
      <div className="points-card">
        <div className="points-icon">
          <span className="material-symbols-outlined fill">toll</span>
        </div>
        <div className="points-info">
          <p className="points-label">能源點數</p>
          <p className="points-value">{mockData.points.toLocaleString()} <span>點</span></p>
        </div>
        <button className="redeem-btn">兌換</button>
      </div>
    </section>

    <section className="monthly-savings">
      <h3>每月節省金額</h3>
      <div className="bar-chart">
        {mockData.monthlyData.map((v, i) => (
          <div key={i} className="bar-item">
            <div className="bar" style={{height: `${v}%`}}></div>
            <span>{i + 1}月</span>
          </div>
        ))}
      </div>
      <p className="avg-savings">平均每月節省: <span>$206.75</span></p>
    </section>

    <section className="initiatives">
      <h3>參與中的計畫</h3>
      <div className="initiative-list">
        <div className="initiative-item active">
          <div className="init-icon orange"><span className="material-symbols-outlined">bolt</span></div>
          <div className="init-info">
            <p className="init-name">尖峰負載反應</p>
            <p className="init-desc">在電網壓力大時減少負載</p>
          </div>
          <span className="init-status">已加入</span>
        </div>
        <div className="initiative-item active">
          <div className="init-icon primary"><span className="material-symbols-outlined">schedule</span></div>
          <div className="init-info">
            <p className="init-name">智慧排程</p>
            <p className="init-desc">優化家電使用時間</p>
          </div>
          <span className="init-status">已加入</span>
        </div>
        <div className="initiative-item disabled">
          <div className="init-icon"><span className="material-symbols-outlined">solar_power</span></div>
          <div className="init-info">
            <p className="init-name">社區太陽能</p>
            <p className="init-desc">分享本地再生能源</p>
          </div>
          <span className="init-status">可申請</span>
        </div>
      </div>
    </section>
  </div>
);

// 設定頁面
const Settings = ({ onNavigate }) => (
  <div className="page">
    <header className="header">
      <button className="back-btn">
        <span className="material-symbols-outlined">arrow_back</span>
      </button>
      <h1>設定</h1>
    </header>

    <section className="profile-section">
      <div className="profile-avatar">
        <span className="material-symbols-outlined">account_circle</span>
        <button className="edit-avatar">
          <span className="material-symbols-outlined">edit</span>
        </button>
      </div>
      <div className="profile-info">
        <p className="profile-name">Alex Johnson</p>
        <p className="profile-email">alex.johnson@ems-energy.com</p>
      </div>
    </section>

    <div className="settings-groups">
      <div className="settings-group">
        <h3>帳戶設定</h3>
        <div className="settings-list">
          <div className="setting-item">
            <span className="material-symbols-outlined primary">person</span>
            <p>個人資料管理</p>
            <span className="material-symbols-outlined chevron">chevron_right</span>
          </div>
          <div className="setting-item">
            <span className="material-symbols-outlined primary">lock</span>
            <p>密碼與安全性</p>
            <span className="material-symbols-outlined chevron">chevron_right</span>
          </div>
        </div>
      </div>

      <div className="settings-group">
        <h3>通知設定</h3>
        <div className="settings-list">
          <div className="setting-item toggle">
            <div className="setting-info">
              <span className="material-symbols-outlined primary">notifications_active</span>
              <div>
                <p>用量警示</p>
                <p className="setting-desc">Notify when daily limit is reached</p>
              </div>
            </div>
            <label className="switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
          </div>
          <div className="setting-item toggle">
            <div className="setting-info">
              <span className="material-symbols-outlined primary">warning</span>
              <div>
                <p>異常偵測</p>
                <p className="setting-desc">Alert on unusual consumption patterns</p>
              </div>
            </div>
            <label className="switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
          </div>
          <div className="setting-item toggle">
            <div className="setting-info">
              <span className="material-symbols-outlined primary">article</span>
              <div>
                <p>每月報告推送</p>
                <p className="setting-desc">Get insights at the end of each month</p>
              </div>
            </div>
            <label className="switch"><input type="checkbox" /><span className="slider"></span></label>
          </div>
        </div>
      </div>

      <div className="settings-group">
        <h3>設備與系統</h3>
        <div className="settings-list">
          <div className="setting-item">
            <span className="material-symbols-outlined primary">devices</span>
            <div>
              <p>已連線設備</p>
              <p className="setting-desc">12 devices active</p>
            </div>
            <span className="material-symbols-outlined chevron">chevron_right</span>
          </div>
          <div className="setting-item">
            <span className="material-symbols-outlined primary">payments</span>
            <div>
              <p>能源計費設定</p>
              <p className="setting-desc">USD, $0.14 per kWh</p>
            </div>
            <span className="material-symbols-outlined chevron">chevron_right</span>
          </div>
          <div className="setting-item">
            <span className="material-symbols-outlined primary">solar_power</span>
            <div>
              <p>太陽能整合</p>
              <p className="setting-desc">Connected to Tesla Powerwall</p>
            </div>
            <span className="material-symbols-outlined chevron">chevron_right</span>
          </div>
        </div>
      </div>
    </div>

    <button className="logout-btn">
      <span className="material-symbols-outlined">logout</span>
      登出
    </button>
    <p className="version">版本 2.4.1 (編譯版本 890)</p>
  </div>
);

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
      <main className="main-content">
        {renderPage()}
      </main>
      <nav className="bottom-nav">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className={`material-symbols-outlined ${activeTab === tab.id ? 'fill' : ''}`}>{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
