import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './App.css';

const generateMockData = () => ({
  currentLoad: Math.round((10 + Math.random() * 5) * 10) / 10,
  yesterdayChange: Math.round((Math.random() * 20 - 10) * 10) / 10,
  todayCost: Math.round((3 + Math.random() * 3) * 100) / 100,
  costChange: Math.round((Math.random() * 10 - 5) * 10) / 10,
  carbon: Math.round((0.5 + Math.random() * 2) * 100) / 100,
  carbonChange: Math.round((Math.random() * 10 - 3) * 10) / 10,
  efficiency: Math.round(85 + Math.random() * 12),
  efficiencyChange: Math.round((Math.random() * 6 - 3) * 10) / 10,
  devices: [
    { id: 1, name: '主電網', status: '在線', statusClass: 'online', icon: 'grid_view', detail: '穩定度：高', voltage: 380, current: 32.6, power: 12.4, temp: 45, uptime: '99.9%' },
    { id: 2, name: '太陽能板', status: '運行中', statusClass: 'running', icon: 'wb_sunny', detail: '正在發電 3.2 kW', voltage: 220, current: 14.5, power: 3.2, temp: 52, uptime: '98.5%' },
    { id: 3, name: '空調系統', status: '運行中', statusClass: 'running', icon: 'ac_unit', detail: '冷房設定 22°C', voltage: 220, current: 8.2, power: 1.8, temp: 24, uptime: '99.2%' },
    { id: 4, name: '充電樁', status: '待機中', statusClass: 'standby', icon: 'ev_station', detail: '最後使用於 2小時前', voltage: 220, current: 0, power: 0, temp: 28, uptime: '97.8%' },
    { id: 5, name: '照明系統', status: '運行中', statusClass: 'running', icon: 'lightbulb', detail: '亮度 80%', voltage: 110, current: 2.5, power: 0.28, temp: 35, uptime: '99.5%' },
    { id: 6, name: 'UPS 不斷電', status: '在線', statusClass: 'online', icon: 'battery_charging_full', detail: '電量 95%', voltage: 48, current: 5, power: 0.24, temp: 32, uptime: '99.8%' },
  ],
  chartData: Array.from({ length: 24 }, (_, i) => ({ time: `${String(i).padStart(2, '0')}:00`, value: Math.round(10 + Math.random() * 30), target: 25 })),
  weeklyData: [
    { day: '週一', value: 285, target: 300 }, { day: '週二', value: 312, target: 300 }, { day: '週三', value: 298, target: 300 },
    { day: '週四', value: 345, target: 300 }, { day: '週五', value: 320, target: 300 }, { day: '週六', value: 256, target: 280 }, { day: '週日', value: 234, target: 280 },
  ],
  savings: Math.round((1000 + Math.random() * 500) * 100) / 100,
  savingsChange: Math.round((5 + Math.random() * 15) * 10) / 10,
  points: Math.round(3000 + Math.random() * 3000),
  carbonSaved: Math.round((1.5 + Math.random() * 2) * 100) / 100,
  trees: Math.round(30 + Math.random() * 30),
  monthlyData: Array.from({ length: 12 }, (_, i) => ({ month: `${i + 1}月`, usage: Math.round(40 + Math.random() * 60), cost: Math.round((40 + Math.random() * 60) * 0.14 * 100) / 100 })),
  hourlyData: Array.from({ length: 24 }, (_, i) => ({ hour: i, usage: Math.round((0.5 + Math.random() * 2.5) * 10) / 10, cost: Math.round((0.5 + Math.random() * 2.5) * 0.14 * 10) / 10 })),
  deviceBreakdown: [ { name: '空調', value: 40, color: '#0f49bd' }, { name: '照明', value: 20, color: '#3b82f6' }, { name: '設備', value: 25, color: '#60a5fa' }, { name: '其他', value: 15, color: '#93c5fd' } ],
  historyData: Array.from({ length: 30 }, (_, i) => ({ date: `2026-02-${String(i + 1).padStart(2, '0')}`, usage: Math.round(200 + Math.random() * 150), cost: Math.round((200 + Math.random() * 150) * 0.14 * 100) / 100, efficiency: Math.round(85 + Math.random() * 12) })),
  user: { name: 'Alex Johnson', email: 'alex.johnson@ems-energy.com', phone: '+886-912-345-678', company: '台灣微網科技' },
  notifications: { usageAlert: true, anomalyAlert: true, monthlyReport: false, emailNotification: true, pushNotification: true },
  alerts: [
    { id: 1, type: 'warning', message: '今日用電量已達80%上限', time: '10:30' },
    { id: 2, type: 'info', message: '太陽能發電效率提升中', time: '09:15' },
    { id: 3, type: 'success', message: '本月節省目標達成！', time: '08:00' },
  ],
});

const Dashboard = ({ onNavigate }) => {
  const [data, setData] = useState(generateMockData());
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showAlerts, setShowAlerts] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setData(prev => ({ ...prev, currentLoad: Math.round((10 + Math.random() * 5) * 10) / 10, efficiency: Math.round(85 + Math.random() * 12) })), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page">
      <header className="header">
        <div className="user-info">
          <div className="avatar"><span className="material-symbols-outlined">account_circle</span></div>
          <div><p className="greeting">歡迎回來</p><h2 className="user-name">{data.user.name}</h2></div>
        </div>
        <button className="notification-btn" onClick={() => setShowAlerts(!showAlerts)}>
          <span className="material-symbols-outlined">notifications</span>
          {data.alerts.length > 0 && <span className="badge-dot"></span>}
        </button>
      </header>

      {showAlerts && (
        <div className="alerts-panel">
          <h3>最近通知</h3>
          {data.alerts.map(alert => (
            <div key={alert.id} className={`alert-item ${alert.type}`}>
              <span className="material-symbols-outlined">{alert.type === 'warning' ? 'warning' : alert.type === 'success' ? 'check_circle' : 'info'}</span>
              <div><p className="alert-message">{alert.message}</p><p className="alert-time">{alert.time}</p></div>
            </div>
          ))}
        </div>
      )}

      <section className="energy-display">
        <span className="energy-label">當前總負載</span>
        <div className="energy-value"><h1>{data.currentLoad.toFixed(1)}</h1><span className="unit">kW</span></div>
        <div className="trend"><span className="material-symbols-outlined">{data.yesterdayChange < 0 ? 'trending_down' : 'trending_up'}</span><span>比昨日 {data.yesterdayChange > 0 ? '增加' : '減少'} {Math.abs(data.yesterdayChange)}%</span></div>
      </section>

      <section className="metrics-grid">
        <div className="metric-card"><span className="material-symbols-outlined metric-icon">payments</span><p className="metric-label">今日總支出</p><p className="metric-value">${data.todayCost.toFixed(2)}</p><span className={`metric-change ${data.costChange > 0 ? 'positive' : 'negative'}`}>{data.costChange}%</span></div>
        <div className="metric-card"><span className="material-symbols-outlined metric-icon eco">eco</span><p className="metric-label">碳足跡</p><p className="metric-value">{data.carbon}kg</p><span className={`metric-change ${data.carbonChange > 0 ? 'positive' : 'negative'}`}>{data.carbonChange}%</span></div>
        <div className="metric-card"><span className="material-symbols-outlined metric-icon amber">bolt</span><p className="metric-label">系統效率</p><p className="metric-value">{data.efficiency}%</p><span className={`metric-change ${data.efficiencyChange > 0 ? 'positive' : 'negative'}`}>{data.efficiencyChange}%</span></div>
      </section>

      <section className="chart-section">
        <div className="chart-header"><h3>即時能耗趨勢</h3></div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" tick={{fontSize: 10}} />
              <YAxis tick={{fontSize: 10}} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#0f49bd" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="target" stroke="#10b981" strokeDasharray="5 5" strokeWidth={1} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="devices-section">
        <div className="section-header"><h3>設備狀態 ({data.devices.filter(d => d.statusClass !== 'standby').length}/{data.devices.length} 運行中)</h3><button className="view-all">查看全部</button></div>
        <div className="devices-list">
          {data.devices.map(device => (
            <div key={device.id} className="device-item clickable" onClick={() => setSelectedDevice(device)}>
              <div className="device-icon"><span className="material-symbols-outlined">{device.icon}</span></div>
              <div className="device-info"><p className="device-name">{device.name}</p><p className="device-detail">{device.detail}</p></div>
              <span className={`device-status ${device.statusClass}`}>{device.status}</span>
            </div>
          ))}
        </div>
        {selectedDevice && (
          <div className="device-detail-modal">
            <div className="modal-header"><h3>{selectedDevice.name}</h3><button onClick={() => setSelectedDevice(null)}><span className="material-symbols-outlined">close</span></button></div>
            <div className="modal-content">
              <div className="detail-row"><span>狀態</span><span className={`status ${selectedDevice.statusClass}`}>{selectedDevice.status}</span></div>
              <div className="detail-row"><span>電壓</span><span>{selectedDevice.voltage} V</span></div>
              <div className="detail-row"><span>電流</span><span>{selectedDevice.current} A</span></div>
              <div className="detail-row"><span>功率</span><span>{selectedDevice.power} kW</span></div>
              <div className="detail-row"><span>溫度</span><span>{selectedDevice.temp}°C</span></div>
              <div className="detail-row"><span>運行時間</span><span>{selectedDevice.uptime}</span></div>
            </div>
            <div className="modal-actions"><button className="btn-primary">控制設備</button><button className="btn-secondary">查看歷史</button></div>
          </div>
        )}
      </section>
    </div>
  );
};

const Analysis = ({ onNavigate }) => {
  const [timeRange, setTimeRange] = useState('日');
  const [showTable, setShowTable] = useState(false);
  const mockData = generateMockData();

  const handleExport = (format) => {
    const data = mockData.historyData;
    let content = format === 'csv' ? 'Date,Usage (kWh),Cost (USD)\n' + data.map(d => `${d.date},${d.usage},${d.cost}`).join('\n') : JSON.stringify(data, null, 2);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `energy_data.${format}`; a.click();
    URL.revokeObjectURL(url);
  };

  const chartData = timeRange === '日' ? mockData.hourlyData : timeRange === '週' ? mockData.weeklyData : mockData.monthlyData;

  return (
    <div className="page">
      <header className="header"><button className="back-btn"><span className="material-symbols-outlined">arrow_back</span></button><h1>數據分析</h1><button className="share-btn" onClick={() => handleExport('csv')}><span className="material-symbols-outlined">download</span></button></header>
      <div className="time-selector">{['日', '週', '月', '年'].map(t => (<label key={t} className={timeRange === t ? 'active' : ''}><input type="radio" name="time" checked={timeRange === t} onChange={() => setTimeRange(t)} /><span>{t}</span></label>))}</div>
      <section className="main-chart">
        <div className="chart-header"><div><p className="chart-label">總能源消耗</p><h2 className="chart-value">{timeRange === '日' ? '12.4 ' : timeRange === '週' ? '2,150 ' : '28,450 '}<span>kWh</span></h2></div><div className="chart-trend positive"><span className="material-symbols-outlined">trending_down</span>5.2%</div></div>
        <div className="chart-container large">
          <ResponsiveContainer width="100%" height={180}><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey={timeRange === '日' ? 'hour' : timeRange === '週' ? 'day' : 'month'} tick={{fontSize: 10}} /><YAxis tick={{fontSize: 10}} /><Tooltip /><Bar dataKey={timeRange === '日' ? 'usage' : 'value'} fill="#0f49bd" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
        </div>
      </section>
      <div className="action-buttons"><button className="action-btn" onClick={() => setShowTable(!showTable)}><span className="material-symbols-outlined">table_chart</span>詳細數據</button><button className="action-btn" onClick={() => handleExport('csv')}><span className="material-symbols-outlined">file_download</span>匯出</button></div>
      {showTable && (<section className="data-table"><table><thead><tr><th>日期</th><th>用電量</th><th>費用</th></tr></thead><tbody>{mockData.historyData.slice(0, 10).map((row, i) => (<tr key={i}><td>{row.date}</td><td>{row.usage} kWh</td><td>${row.cost.toFixed(2)}</td></tr>))}</tbody></table></section>)}
      <div className="two-col">
        <section className="breakdown"><h3>設備分類用電</h3><div className="donut-chart"><ResponsiveContainer width="100%" height={160}><PieChart><Pie data={mockData.deviceBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60}>{mockData.deviceBreakdown.map((entry, index) => (<Cell key={index} fill={entry.color} />))}</Pie><Tooltip /></PieChart></ResponsiveContainer></div><div className="breakdown-list">{mockData.deviceBreakdown.map(item => (<div key={item.name} className="breakdown-item"><span className="dot" style={{background: item.color}}></span>{item.name} {item.value}%</div>))}</div></section>
        <section className="comparison"><h3>比較分析</h3><div className="comparison-item"><div className="comp-label"><span>本月</span><span>452.8 kWh</span></div><div className="comp-bar"><div style={{width: '75%'}}></div></div></div><div className="comparison-item"><div className="comp-label"><span>上個月</span><span>477.1 kWh</span></div><div className="comp-bar"><div style={{width: '80%'}}></div></div></div><div className="benefit-badge"><span className="material-symbols-outlined">auto_graph</span><p>效益分析</p><p className="benefit-value">+12.4% 優於平均</p></div></section>
      </div>
    </div>
  );
};

const Benefits = ({ onNavigate }) => {
  const [showRedeem, setShowRedeem] = useState(false);
  const mockData = generateMockData();
  const redeemOptions = [ { id: 1, name: '亞馬遜禮券 $10', points: 1000, icon: 'card_giftcard', stock: 50 }, { id: 2, name: '星巴克咖啡', points: 500, icon: 'coffee', stock: 100 }, { id: 3, name: '植物種植', points: 300, icon: 'grass', stock: 200 }, { id: 4, name: '慈善捐款 $5', points: 800, icon: 'volunteer_activism', stock: 999 } ];
  const handleRedeem = (option) => { alert(mockData.points >= option.points ? `成功兌換 ${option.name}！\n扣除 ${option.points} 點` : `點數不足！\n需要: ${option.points} 點\n現有: ${mockData.points} 點`); setShowRedeem(false); };

  return (
    <div className="page">
      <header className="header"><button className="back-btn"><span className="material-symbols-outlined">arrow_back</span></button><h1>效益分析</h1><button className="settings-btn"><span className="material-symbols-outlined">share</span></button></header>
      <section className="savings-hero"><p className="savings-label">今年總節省</p><div className="savings-value"><h2>${mockData.savings.toFixed(2)}</h2><span className="savings-trend positive"><span className="material-symbols-outlined">trending_up</span>+{mockData.savingsChange}%</span></div></section>
      <section className="env-impact"><h3>環境影響</h3><div className="env-grid"><div className="env-card" onClick={() => alert(`二氧化碳減排量：${mockData.carbonSaved} 公噸`)}><span className="material-symbols-outlined eco">co2</span><p className="env-value">{mockData.carbonSaved} 公噸</p><p className="env-label">二氧化碳減排量</p></div><div className="env-card" onClick={() => alert(`等效種植：${mockData.trees} 棵樹`)}><span className="material-symbols-outlined primary">forest</span><p className="env-value">{mockData.trees} 棵</p><p className="env-label">等效樹林量</p></div></div></section>
      <section className="points-section"><div className="points-card"><div className="points-icon"><span className="material-symbols-outlined fill">toll</span></div><div className="points-info"><p className="points-label">能源點數</p><p className="points-value">{mockData.points.toLocaleString()} <span>點</span></p></div><button className="redeem-btn" onClick={() => setShowRedeem(!showRedeem)}>{showRedeem ? '關閉' : '兌換'}</button></div></section>
      {showRedeem && (<section className="redeem-modal"><h3>兌換中心</h3><div className="redeem-list">{redeemOptions.map(option => (<div key={option.id} className="redeem-item" onClick={() => handleRedeem(option)}><span className="material-symbols-outlined">{option.icon}</span><div className="redeem-info"><p className="redeem-name">{option.name}</p><p className="redeem-points">{option.points} 點</p></div><span className="material-symbols-outlined">chevron_right</span></div>))}</div></section>)}
      <section className="monthly-savings"><h3>每月節省金額</h3><div className="chart-container"><ResponsiveContainer width="100%" height={150}><BarChart data={mockData.monthlyData}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="month" tick={{fontSize: 10}} /><YAxis tick={{fontSize: 10}} /><Tooltip /><Bar dataKey="usage" fill="#0f49bd" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div><p className="avg-savings">平均每月節省: <span>$206.75</span></p></section>
      <section className="initiatives"><h3>參與中的計畫</h3><div className="initiative-list"><div className="initiative-item active"><div className="init-icon orange"><span className="material-symbols-outlined">bolt</span></div><div className="init-info"><p className="init-name">尖峰負載反應</p><p className="init-desc">響應電網需求，獲得獎勵點數</p></div><span className="init-status">已加入</span></div><div className="initiative-item active"><div className="init-icon primary"><span className="material-symbols-outlined">schedule</span></div><div className="init-info"><p className="init-name">智慧排程</p><p className="init-desc">AI 優化用電時間</p></div><span className="init-status">已加入</span></div></div></section>
    </div>
  );
};

const Settings = ({ onNavigate }) => {
  const [notifications, setNotifications] = useState({ usageAlert: true, anomalyAlert: true, monthlyReport: false });
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [userData, setUserData] = useState({ name: 'Alex Johnson', email: 'alex.johnson@ems-energy.com', phone: '+886-912-345-678', company: '台灣微網科技' });

  const handleProfileSave = (e) => { e.preventDefault(); const fd = new FormData(e.target); setUserData({ name: fd.get('name'), email: fd.get('email'), phone: fd.get('phone'), company: fd.get('company') }); setShowProfileEdit(false); alert('個人資料已更新！'); };

  return (
    <div className="page">
      <header className="header"><button className="back-btn"><span className="material-symbols-outlined">arrow_back</span></button><h1>設定</h1></header>
      <section className="profile-section"><div className="profile-avatar large"><span className="material-symbols-outlined">account_circle</span><button className="edit-avatar" onClick={() => setShowProfileEdit(true)}><span className="material-symbols-outlined">edit</span></button></div><div className="profile-info"><p className="profile-name">{userData.name}</p><p className="profile-email">{userData.email}</p><p className="profile-company">{userData.company}</p></div></section>
      {showProfileEdit && (<section className="edit-modal"><form onSubmit={handleProfileSave}><h3>編輯個人資料</h3><div className="form-group"><label>姓名</label><input type="text" name="name" defaultValue={userData.name} /></div><div className="form-group"><label>電子郵件</label><input type="email" name="email" defaultValue={userData.email} /></div><div className="form-group"><label>電話</label><input type="tel" name="phone" defaultValue={userData.phone} /></div><div className="form-group"><label>公司</label><input type="text" name="company" defaultValue={userData.company} /></div><div className="form-actions"><button type="button" className="cancel-btn" onClick={() => setShowProfileEdit(false)}>取消</button><button type="submit" className="save-btn">儲存</button></div></form></section>)}
      <div className="settings-groups">
        <div className="settings-group"><h3>帳戶設定</h3><div className="settings-list"><div className="setting-item clickable"><span className="material-symbols-outlined primary">person</span><p>個人資料管理</p><span className="material-symbols-outlined chevron">chevron_right</span></div><div className="setting-item clickable"><span className="material-symbols-outlined primary">lock</span><p>密碼與安全性</p><span className="material-symbols-outlined chevron">chevron_right</span></div></div></div>
        <div className="settings-group"><h3>通知設定</h3><div className="settings-list">
          <div className="setting-item toggle"><div className="setting-info"><span className="material-symbols-outlined primary">notifications_active</span><div><p>用量警示</p><p className="setting-desc">超過每日上限時通知</p></div></div><label className="switch"><input type="checkbox" checked={notifications.usageAlert} onChange={() => setNotifications(p => ({...p, usageAlert: !p.usageAlert}))} /><span className="slider"></span></label></div>
          <div className="setting-item toggle"><div className="setting-info"><span className="material-symbols-outlined primary">warning</span><div><p>異常偵測</p><p className="setting-desc">用電異常時警示</p></div></div><label className="switch"><input type="checkbox" checked={notifications.anomalyAlert} onChange={() => setNotifications(p => ({...p, anomalyAlert: !p.anomalyAlert}))} /><span className="slider"></span></label></div>
          <div className="setting-item toggle"><div className="setting-info"><span className="material-symbols-outlined primary">article</span><div><p>每月報告推送</p><p className="setting-desc">每月能源使用報告</p></div></div><label className="switch"><input type="checkbox" checked={notifications.monthlyReport} onChange={() => setNotifications(p => ({...p, monthlyReport: !p.monthlyReport}))} /><span className="slider"></span></label></div>
        </div></div>
        <div className="settings-group"><h3>設備與系統</h3><div className="settings-list"><div className="setting-item clickable"><span className="material-symbols-outlined primary">devices</span><div><p>已連線設備</p><p className="setting-desc">6 個設備在線</p></div><span className="material-symbols-outlined chevron">chevron_right</span></div><div className="setting-item clickable"><span className="material-symbols-outlined primary">payments</span><div><p>能源計費設定</p><p className="setting-desc">$0.14 per kWh</p></div><span className="material-symbols-outlined chevron">chevron_right</span></div></div></div>
      </div>
      <button className="logout-btn"><span className="material-symbols-outlined">logout</span>登出</button><p className="version">版本 2.4.1 (Build 890)</p>
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const tabs = [ { id: 'dashboard', icon: 'grid_view', label: '儀表板' }, { id: 'analysis', icon: 'analytics', label: '數據分析' }, { id: 'benefits', icon: 'redeem', label: '效益分析' }, { id: 'settings', icon: 'settings', label: '設定' } ];
  const renderPage = () => { switch (activeTab) { case 'dashboard': return <Dashboard />; case 'analysis': return <Analysis />; case 'benefits': return <Benefits />; case 'settings': return <Settings />; default: return <Dashboard />; } };
  return (<div className="app"><main className="main-content">{renderPage()}</main><nav className="bottom-nav">{tabs.map(tab => (<button key={tab.id} className={`nav-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}><span className={`material-symbols-outlined ${activeTab === tab.id ? 'fill' : ''}`}>{tab.icon}</span><span className="nav-label">{tab.label}</span></button>))}</nav></div>);
}

export default App;
