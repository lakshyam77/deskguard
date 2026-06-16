import React, { useState, useEffect } from 'react';
import LibraryMap from './LibraryMap';

export default function App() {
  // Hardcoded initial data so it works perfectly without a backend connection!
  const [desks, setDesks] = useState([
    { id: 'd1', name: 'Desk A1', status: 'Free', user: null, awayTimeLeft: null },
    { id: 'd2', name: 'Desk A2', status: 'Occupied', user: 'Student_User_42', awayTimeLeft: null },
    { id: 'd3', name: 'Desk A3', status: 'Free', user: null, awayTimeLeft: null },
    { id: 'd4', name: 'Desk A4', status: 'Away', user: 'Student_User_11', awayTimeLeft: 1200 },
    { id: 'd5', name: 'Desk B1', status: 'Free', user: null, awayTimeLeft: null },
    { id: 'd6', name: 'Desk B2', status: 'Occupied', user: 'Student_User_09', awayTimeLeft: null },
    { id: 'd7', name: 'Desk B3', status: 'Free', user: null, awayTimeLeft: null },
    { id: 'd8', name: 'Desk B4', status: 'Free', user: null, awayTimeLeft: null },
  ]);
  
  const [selectedDesk, setSelectedDesk] = useState(null);
  const [activeUser] = useState('Current_Student_User');
  const [isLibrarianMode, setIsLibrarianMode] = useState(false);

  // Local state synchronization to keep selection up to date
  useEffect(() => {
    if (selectedDesk) {
      const updated = desks.find(d => d.id === selectedDesk.id);
      setSelectedDesk(updated);
    }
  }, [desks]);

  // Local simulation handlers
  const handleCheckIn = (deskId) => {
    setDesks(prev => prev.map(d => d.id === deskId ? { ...d, status: 'Occupied', user: activeUser } : d));
  };

  const handleGoAway = (deskId) => {
    setDesks(prev => prev.map(d => d.id === deskId ? { ...d, status: 'Away', awayTimeLeft: 1200 } : d));
  };

  const handleReturn = (deskId) => {
    setDesks(prev => prev.map(d => d.id === deskId ? { ...d, status: 'Occupied', awayTimeLeft: null } : d));
  };

  const handleRelease = (deskId) => {
    setDesks(prev => prev.map(d => d.id === deskId ? { ...d, status: 'Free', user: null, awayTimeLeft: null } : d));
  };

  // Simulated countdown interval for break sessions
  useEffect(() => {
    const timer = setInterval(() => {
      setDesks(prev => prev.map(d => {
        if (d.status === 'Away' && d.awayTimeLeft > 0) {
          if (d.awayTimeLeft <= 1) {
            return { ...d, status: 'Free', user: null, awayTimeLeft: null };
          }
          return { ...d, awayTimeLeft: d.awayTimeLeft - 1 };
        }
        return d;
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalDesks = desks.length;
  const occupiedCount = desks.filter(d => d.status === 'Occupied').length;
  const awayCount = desks.filter(d => d.status === 'Away').length;
  const freeCount = totalDesks - occupiedCount - awayCount;

  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      <header className="bg-slate-900 text-white px-6 py-4 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black tracking-wider text-blue-400">DESK<span className="text-white">GUARD</span></span>
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 font-mono">v2.2 (SUBMIT)</span>
        </div>
        
        <button
          onClick={() => setIsLibrarianMode(!isLibrarianMode)}
          className={`px-4 py-1.5 rounded-lg font-bold text-xs transition duration-200 uppercase tracking-wider shadow-sm ${
            isLibrarianMode 
              ? 'bg-purple-600 text-white hover:bg-purple-700 ring-2 ring-purple-300' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {isLibrarianMode ? '📋 Mode: Librarian / Admin' : '🧑‍🎓 Mode: Student'}
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Available</p>
              <p className="text-2xl font-black text-green-600">{freeCount}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Studying</p>
              <p className="text-2xl font-black text-red-500">{occupiedCount}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Away (On Break)</p>
              <p className="text-2xl font-black text-yellow-500">{awayCount}</p>
            </div>
          </div>

          <LibraryMap 
            desks={desks} 
            selectedDesk={selectedDesk} 
            onSelectDesk={setSelectedDesk} 
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between min-h-[350px]">
          <div>
            <h3 className={`text-lg font-bold border-b border-gray-100 pb-3 mb-4 flex items-center gap-2 ${
              isLibrarianMode ? 'text-purple-700' : 'text-gray-800'
            }`}>
              {isLibrarianMode ? '📋 Librarian Admin Panel' : '🧑‍🎓 Student Control Panel'}
            </h3>

            {selectedDesk ? (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Target Unit</label>
                  <p className="text-xl font-black text-slate-800">{selectedDesk.name}</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Current Status</label>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm
                    ${selectedDesk.status === 'Free' ? 'bg-green-100 text-green-800' : ''}
                    ${selectedDesk.status === 'Occupied' ? 'bg-red-100 text-red-800' : ''}
                    ${selectedDesk.status === 'Away' ? 'bg-yellow-100 text-yellow-800 font-mono' : ''}
                  `}>
                    {selectedDesk.status.toUpperCase()}
                  </span>
                </div>

                {selectedDesk.user && (
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Occupied By</label>
                    <p className="text-sm font-mono font-medium text-gray-700 bg-gray-50 px-2 py-1 inline-block rounded mt-1 border border-gray-200">
                      {selectedDesk.user}
                    </p>
                  </div>
                )}

                {selectedDesk.status === 'Away' && (
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                    <label className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Session Expiry Countdown</label>
                    <p className="text-2xl font-mono font-bold text-amber-600 tracking-wider mt-1 animate-pulse">
                      {formatTime(selectedDesk.awayTimeLeft)}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100 space-y-3">
                  {isLibrarianMode ? (
                    <div className="space-y-2 bg-purple-50 p-3 rounded-xl border border-purple-100">
                      <p className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-2">🛡️ Librarian Overrides</p>
                      {selectedDesk.status !== 'Free' ? (
                        <button
                          onClick={() => handleRelease(selectedDesk.id)}
                          className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition text-sm shadow-sm"
                        >
                          ⚠️ Force Free / Evict Occupant
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCheckIn(selectedDesk.id)}
                          className="w-full bg-slate-800 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-900 transition text-sm shadow-sm"
                        >
                          🔒 Assign Desk to Walk-in
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      {selectedDesk.status === 'Free' && (
                        <button
                          onClick={() => handleCheckIn(selectedDesk.id)}
                          className="w-full bg-blue-600 text-white font-bold py-2.5 px-4 rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-2"
                        >
                          📷 Scan QR to Check-In
                        </button>
                      )}

                      {selectedDesk.status === 'Occupied' && (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleGoAway(selectedDesk.id)}
                            className="bg-yellow-500 text-white font-bold py-2 px-3 rounded-xl hover:bg-yellow-600 transition text-sm"
                          >
                            ⏱️ Take Away Break
                          </button>
                          <button
                            onClick={() => handleRelease(selectedDesk.id)}
                            className="bg-gray-600 text-white font-bold py-2 px-3 rounded-xl hover:bg-gray-700 transition text-sm"
                          >
                            🚪 Free Desk Now
                          </button>
                        </div>
                      )}

                      {selectedDesk.status === 'Away' && (
                        <button
                          onClick={() => handleReturn(selectedDesk.id)}
                          className="w-full bg-green-600 text-white font-bold py-2.5 px-4 rounded-xl hover:bg-green-700 transition shadow-sm"
                        >
                          🔄 Resume Session (Still Here)
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p className="text-sm">No desk node selected from layout.</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-100 bg-slate-50 p-3 rounded-lg text-xs text-slate-500 flex justify-between items-center">
            <span><strong>Status:</strong> Demo Sandbox Engine Live</span>
            <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">PROTOTYPE</span>
          </div>
        </div>
      </main>
    </div>
  );
}