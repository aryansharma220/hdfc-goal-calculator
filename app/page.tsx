"use client";
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function GoalCalculator() {

  const [inputs, setInputs] = useState({
    cost: 500000,
    years: 10,
    inflation: 6,
    returns: 12
  });

 
  const [goalName, setGoalName] = useState("");


  const [results, setResults] = useState({
    futureGoalValue: 0,
    requiredSIP: 0,
    totalInvestment: 0,
    estimatedEarnings: 0
  });

  useEffect(() => {
    const r = (inputs.returns / 100) / 12;
    const n = inputs.years * 12;
    const inflatedCost = inputs.cost * Math.pow(1 + inputs.inflation / 100, inputs.years);
    
    const sip = (inflatedCost * r) / (Math.pow(1 + r, n) - 1);
    const totalInv = sip * n;
    
    setResults({
      futureGoalValue: Math.round(inflatedCost),
      requiredSIP: Math.round(sip),
      totalInvestment: Math.round(totalInv),
      estimatedEarnings: Math.round(inflatedCost - totalInv)
    });
  }, [inputs]);


  const handleSave = async () => {
    if (!goalName) {
      alert("Please enter a Goal Name first!");
      return;
    }

    try {
      const response = await fetch('/api/save-goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalName,
          cost: inputs.cost,
          years: inputs.years,
          inflation: inputs.inflation,
          returns: inputs.returns,
          futureValue: results.futureGoalValue,
          sip: results.requiredSIP
        }),
      });

      if (response.ok) {
        alert("🎉 Mubarak ho! Goal MySQL database mein save ho gaya.");
        setGoalName(""); 
      } else {
        alert("❌ Error: Save nahi ho paaya.");
      }
    } catch (err) {
      console.error(err);
      alert("Network Error!");
    }
  };

  const data = [
    { name: 'Invested Amount', value: results.totalInvestment },
    { name: 'Estimated Earnings', value: results.estimatedEarnings },
  ];

  const COLORS = ['#224c87', '#da3832'];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#224c87] p-6 text-white text-center">
          <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">HDFC Goal Calculator</h1>
          <p className="text-sm opacity-90 mt-1">Plan your future, save to MySQL database</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
          
          {/* Column 1: Inputs */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-[#224c87] border-b pb-2">Set Your Goal</h2>
            
            <div>
              <label htmlFor="current-cost" className="block text-sm font-medium text-gray-700 mb-1">Current Cost of Goal (₹)</label>
              <input id="current-cost" type="number" value={inputs.cost} onChange={(e) => setInputs({...inputs, cost: Number(e.target.value)})} className="w-full p-2 border rounded-lg text-black focus:ring-2 focus:ring-[#224c87] outline-none" />
            </div>

            <div>
              <label htmlFor="time-horizon" className="block text-sm font-medium text-gray-700 mb-1">Time Horizon (Years)</label>
              <input id="time-horizon" type="range" min="1" max="30" value={inputs.years} onChange={(e) => setInputs({...inputs, years: Number(e.target.value)})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#224c87]" />
              <p className="text-right text-sm font-bold text-[#224c87]">{inputs.years} Years</p>
            </div>

            <div>
              <label htmlFor="expected-inflation" className="block text-sm font-medium text-gray-700 mb-1">Expected Inflation (%)</label>
              <input id="expected-inflation" type="number" value={inputs.inflation} onChange={(e) => setInputs({...inputs, inflation: Number(e.target.value)})} className="w-full p-2 border rounded-lg text-black" />
            </div>

            <div>
              <label htmlFor="expected-returns" className="block text-sm font-medium text-gray-700 mb-1">Expected Returns (%)</label>
              <input id="expected-returns" type="number" value={inputs.returns} onChange={(e) => setInputs({...inputs, returns: Number(e.target.value)})} className="w-full p-2 border rounded-lg text-black" />
            </div>
          </div>

          {/* Column 2: Chart */}
          <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">Investment Breakdown</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-4 text-xs font-bold">
              <div className="flex items-center gap-1"><span className="w-3 h-3 bg-[#224c87] rounded"></span> Invested</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 bg-[#da3832] rounded"></span> Earnings</div>
            </div>
          </div>

          {/* Column 3: Results & Database Save */}
          <div className="bg-[#f8faff] border-2 border-[#224c87]/10 rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">Future Goal Value</p>
                <p className="text-3xl font-black text-[#224c87]">₹{results.futureGoalValue.toLocaleString()}</p>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-[#da3832]">
                <p className="text-xs text-gray-500 font-bold uppercase">Monthly SIP Required</p>
                <p className="text-4xl font-black text-[#da3832]">₹{results.requiredSIP.toLocaleString()}</p>
              </div>
            </div>

            {/* SAVE SECTION */}
            <div className="mt-8 space-y-3 pt-6 border-t border-gray-200">
              <label className="block text-xs font-black text-[#224c87] uppercase">Save this plan</label>
              <input 
                type="text" 
                placeholder="Enter Name (e.g. Retirement)" 
                className="w-full p-3 border border-gray-300 rounded-lg text-sm text-black shadow-inner"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
              />
              <button 
                onClick={handleSave}
                className="w-full bg-[#224c87] text-white font-bold py-4 rounded-xl hover:bg-[#1a3a66] shadow-lg transform active:scale-95 transition-all"
              >
                SAVE GOAL TO DATABASE
              </button>
            </div>
          </div>

        </div>
      </div>
      <p className="text-center text-gray-400 mt-6 text-xs italic">Varsha&apos;s HDFC Calculator - Powering Financial Goals</p>
    </div>
  );
}