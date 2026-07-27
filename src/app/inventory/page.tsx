"use client"

import React, { useState, useEffect } from 'react';
import ResourceOverview from '../../components/inventory/ResourceOverview';
import UsageTrends from '../../components/inventory/UsageTrends';
import InventoryTable from '../../components/inventory/InventoryTable';
import { mockInventoryData } from '../data/mockInventoryData';
import { InventoryData } from '../../lib/types';

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [data, setData] = useState<InventoryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        setIsLoading(true);
        setTimeout(() => {
          setData(mockInventoryData);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        console.error(err);
        setError("Failed to load inventory data.");
        setIsLoading(false);
      }
    };

    fetchInventoryData();
  }, []);

  if (isLoading) {
    return <div className="p-10 text-gray-500 font-medium">Loading inventory data...</div>;
  }

  if (error) {
    return <div className="p-10 text-red-500 font-medium">{error}</div>;
  }

  return (
    <div className="w-full bg-[#fcfcfc] min-h-screen text-gray-900 p-10">
      <h1 className="text-[28px] font-bold mb-8 tracking-tight">Inventory</h1>

      <div className="flex justify-between items-center border-b border-gray-200 mb-8">
        <div className="flex gap-6 h-full items-end">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-sm font-semibold border-b-2 -mb-[1px] transition-colors ${
              activeTab === 'overview'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-3 text-sm font-semibold border-b-2 -mb-[1px] transition-colors ${
              activeTab === 'inventory'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            Inventory
          </button>
        </div>
        <div className="pb-3">
          <button className="bg-[#3a4ec5] text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm">
            Log resource
          </button>
        </div>
      </div>

      {activeTab === 'overview' && data && (
        <div className="animate-in fade-in duration-300">
          <ResourceOverview overviewData={data.overview} />
          <UsageTrends trendsData={data.trends} />
        </div>
      )}

      {activeTab === 'inventory' && data && (
        <InventoryTable inventoryList={data.inventoryList} />
      )}
    </div>
  );
}