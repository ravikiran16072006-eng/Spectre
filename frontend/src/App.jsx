import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [state, setState] = useState({
    alerts: [],
    timeline: [],
    memoryLog: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/data`);
      setState(res.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const runAgent = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/run`);
      if (res.data.state) {
        setState(res.data.state);
      }
    } catch (err) {
      console.error('Error running agent:', err);
    }
    setLoading(false);
  };

  const sendPrompt = async (prompt) => {
    alert(`Sending prompt to Agent: "${prompt}"\n(This connects to backend /api/prompt)`);
  };

  return (
    <div className="flex h-screen min-h-[600px] bg-[var(--color-background-tertiary)] font-sans text-sm">
      {/* Sidebar */}
      <div className="w-[200px] bg-[var(--color-background-primary)] border-r border-[var(--color-border-tertiary)] p-4 flex flex-col gap-1 shrink-0">
        <div className="text-sm font-medium text-[var(--color-text-primary)] pb-4 mb-2 border-b border-[var(--color-border-tertiary)]">
          Intel<span className="text-[#185FA5]">Agent</span>
        </div>
        <div className="py-[7px] px-[10px] rounded-md text-[13px] text-[#185FA5] bg-[#E6F1FB] font-medium cursor-pointer flex items-center gap-2">
          <div className="w-[7px] h-[7px] rounded-full bg-current opacity-60"></div> Dashboard
        </div>
        <div className="py-[7px] px-[10px] rounded-md text-[13px] text-[var(--color-text-secondary)] cursor-pointer flex items-center gap-2 hover:bg-gray-50">
          <div className="w-[7px] h-[7px] rounded-full bg-current opacity-60"></div> Alerts
        </div>
        <div className="py-[7px] px-[10px] rounded-md text-[13px] text-[var(--color-text-secondary)] cursor-pointer flex items-center gap-2 hover:bg-gray-50">
          <div className="w-[7px] h-[7px] rounded-full bg-current opacity-60"></div> Memory log
        </div>
        <div className="py-[7px] px-[10px] rounded-md text-[13px] text-[var(--color-text-secondary)] cursor-pointer flex items-center gap-2 hover:bg-gray-50">
          <div className="w-[7px] h-[7px] rounded-full bg-current opacity-60"></div> Reports
        </div>
        
        <div className="mt-4">
          <div className="text-[11px] text-[var(--color-text-tertiary)] px-[10px] mb-1.5 tracking-wider">COMPETITORS</div>
          <div className="py-1.5 px-[10px] rounded-md text-[13px] flex items-center justify-between cursor-pointer bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] font-medium">
            Notion <span className="text-[10px] py-0.5 px-1.5 rounded-full font-medium bg-[#FCEBEB] text-[#A32D2D]">High</span>
          </div>
          <div className="py-1.5 px-[10px] rounded-md text-[13px] flex items-center justify-between cursor-pointer text-[var(--color-text-secondary)] hover:bg-[var(--color-background-secondary)]">
            Asana <span className="text-[10px] py-0.5 px-1.5 rounded-full font-medium bg-[#FAEEDA] text-[#854F0B]">Med</span>
          </div>
          <div className="py-1.5 px-[10px] rounded-md text-[13px] flex items-center justify-between cursor-pointer text-[var(--color-text-secondary)] hover:bg-[var(--color-background-secondary)]">
            Linear <span className="text-[10px] py-0.5 px-1.5 rounded-full font-medium bg-[#EAF3DE] text-[#3B6D11]">Low</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="text-base font-medium text-[var(--color-text-primary)]">Competitive overview</div>
          <button 
            onClick={runAgent}
            disabled={loading}
            className="text-xs py-1.5 px-3.5 rounded-md bg-[#185FA5] text-white font-medium hover:bg-blue-800 disabled:opacity-50"
          >
            {loading ? 'Running...' : 'Run agent now ↗'}
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-4 gap-2.5">
          <div className="bg-[var(--color-background-secondary)] rounded-md py-3 px-4">
            <div className="text-[11px] text-[var(--color-text-tertiary)] mb-1">Competitors tracked</div>
            <div className="text-[22px] font-medium text-[var(--color-text-primary)]">3</div>
            <div className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">Active monitoring</div>
          </div>
          <div className="bg-[var(--color-background-secondary)] rounded-md py-3 px-4">
            <div className="text-[11px] text-[var(--color-text-tertiary)] mb-1">Alerts this week</div>
            <div className="text-[22px] font-medium text-[var(--color-text-primary)]">{state.alerts.length}</div>
            <div className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">Updated just now</div>
          </div>
          <div className="bg-[var(--color-background-secondary)] rounded-md py-3 px-4">
            <div className="text-[11px] text-[var(--color-text-tertiary)] mb-1">Memory entries</div>
            <div className="text-[22px] font-medium text-[var(--color-text-primary)]">{state.memoryLog.length}</div>
            <div className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">Stored in Hindsight</div>
          </div>
          <div className="bg-[var(--color-background-secondary)] rounded-md py-3 px-4">
            <div className="text-[11px] text-[var(--color-text-tertiary)] mb-1">Last scan</div>
            <div className="text-base font-medium text-[var(--color-text-primary)] mt-1">Just now</div>
            <div className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">Next in 24h</div>
          </div>
        </div>

        {/* Alerts List */}
        <div>
          <div className="text-[13px] font-medium text-[var(--color-text-secondary)] mb-2">Recent alerts</div>
          <div className="flex flex-col gap-2">
            {state.alerts.map((alert, i) => (
              <div key={i} className={`bg-[var(--color-background-primary)] border rounded-lg p-3 flex gap-3 items-start border-[var(--color-border-tertiary)] ${alert.urgency === 'High' ? 'border-l-[3px] border-l-[#E24B4A]' : alert.urgency === 'Med' ? 'border-l-[3px] border-l-[#EF9F27]' : 'border-l-[3px] border-l-[#639922]'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 mt-px ${alert.urgency === 'High' ? 'bg-[#FCEBEB] text-[#A32D2D]' : alert.urgency === 'Med' ? 'bg-[#FAEEDA] text-[#854F0B]' : 'bg-[#EAF3DE] text-[#3B6D11]'}`}>
                  {alert.comp?.[0]}
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-medium text-[var(--color-text-secondary)] mb-0.5">{alert.comp}</div>
                  <div className="text-[13px] font-medium text-[var(--color-text-primary)] mb-1">{alert.title}</div>
                  <div className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{alert.desc}</div>
                  <div className="text-[11px] text-[var(--color-text-tertiary)] mt-1">{alert.date} · {alert.urgency} urgency</div>
                </div>
                <span className={`text-[10px] py-0.5 px-1.5 rounded-full font-medium ${alert.urgency === 'High' ? 'bg-[#FCEBEB] text-[#A32D2D]' : alert.urgency === 'Med' ? 'bg-[#FAEEDA] text-[#854F0B]' : 'bg-[#EAF3DE] text-[#3B6D11]'}`}>
                  {alert.urgency}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Two Columns */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[var(--color-background-primary)] border border-[var(--color-border-tertiary)] rounded-lg p-4">
            <div className="text-[13px] font-medium text-[var(--color-text-secondary)] mb-2">Notion — change timeline</div>
            <div className="flex gap-1.5 flex-wrap mb-3">
              <div className="text-[11px] py-1 px-2.5 rounded-full cursor-pointer border border-[#B5D4F4] bg-[#E6F1FB] text-[#185FA5]">All</div>
              <div className="text-[11px] py-1 px-2.5 rounded-full cursor-pointer border border-[var(--color-border-tertiary)] bg-[var(--color-background-secondary)] text-[var(--color-text-secondary)]">Pricing</div>
            </div>
            
            <div className="flex flex-col gap-2.5">
              {state.timeline.map((item, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <div className="flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${item.color === 'red' ? 'bg-[#E24B4A]' : item.color === 'amber' ? 'bg-[#EF9F27]' : item.color === 'blue' ? 'bg-[#378ADD]' : 'bg-[#888780]'}`}></div>
                    {i !== state.timeline.length - 1 && <div className="w-px h-2.5 bg-[var(--color-border-tertiary)] mt-1"></div>}
                  </div>
                  <div className="flex-1 -mt-0.5">
                    <div className="text-xs text-[var(--color-text-primary)] leading-relaxed">{item.text}</div>
                    <div className="text-[11px] text-[var(--color-text-tertiary)]">{item.date}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-[#E6F1FB] rounded-md p-3 mt-3">
               <div className="text-[11px] font-medium text-[#185FA5] mb-1">AI insight from Hindsight memory</div>
               <div className="text-xs text-[#0C447C] leading-relaxed">Pattern detected: Competitor is evolving rapidly. Review timeline and newly scraped changes logic in relation to prior data to assess competitive impact. Update strategy accordingly.</div>
            </div>
          </div>
          
          <div className="bg-[var(--color-background-primary)] border border-[var(--color-border-tertiary)] rounded-lg p-4 flex flex-col gap-5">
            <div>
              <div className="text-[13px] font-medium text-[var(--color-text-secondary)] mb-2">Hindsight memory log</div>
              <div className="flex flex-col gap-1.5">
                {state.memoryLog.map((log, i) => (
                  <div key={i} className="text-xs py-2 px-2.5 bg-[var(--color-background-secondary)] rounded-md text-[var(--color-text-primary)]">
                     <span className="text-[11px] text-[var(--color-text-tertiary)]">{log.key}</span><br/>
                     Stored: "{log.value}"
                  </div>
                ))}
              </div>
            </div>
            
            <div>
               <div className="text-[13px] font-medium text-[var(--color-text-secondary)] mb-2">Ask the agent</div>
               <div className="flex flex-col gap-1.5">
                 <button onClick={() => sendPrompt('What is Notion planning?')} className="text-left text-xs p-2 rounded-md bg-[var(--color-background-secondary)] border border-[var(--color-border-tertiary)] text-[var(--color-text-primary)] hover:bg-[#e2e8f0]">What is Notion planning? ↗</button>
                 <button onClick={() => sendPrompt('How should we respond to pricing drop?')} className="text-left text-xs p-2 rounded-md bg-[var(--color-background-secondary)] border border-[var(--color-border-tertiary)] text-[var(--color-text-primary)] hover:bg-[#e2e8f0]">How should we respond to pricing drop? ↗</button>
               </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default App;
