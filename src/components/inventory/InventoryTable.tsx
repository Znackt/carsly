import React from 'react';

export default function InventoryTable({ inventoryList }: any) {
  if (!inventoryList || inventoryList.length === 0) return (
    <div className="p-6 text-gray-500 border border-gray-200 rounded-xl bg-white">No inventory items found.</div>
  );

  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-xl font-bold mb-5">Inventory Management</h2>
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-white">
              <th className="py-4 px-6 text-sm font-semibold text-gray-600 w-1/3">Item</th>
              <th className="py-4 px-6 text-sm font-semibold text-gray-600">Quantity</th>
              <th className="py-4 px-6 text-sm font-semibold text-gray-600">Unit</th>
              <th className="py-4 px-6 text-sm font-semibold text-gray-600">Reorder Point</th>
              <th className="py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventoryList.map((row: any, idx: number) => (
              <tr
                key={row.id}
                className={idx !== inventoryList.length - 1 ? 'border-b border-gray-100' : ''}
              >
                <td className="py-4 px-6 text-sm text-gray-800 font-medium flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-[#3a4ec5] focus:ring-[#3a4ec5] cursor-pointer"
                  />
                  {row.item}
                </td>
                <td className="py-5 px-6 text-sm text-gray-500">{row.quantity}</td>
                <td className="py-5 px-6 text-sm text-gray-500">{row.unit}</td>
                <td className="py-5 px-6 text-sm text-gray-500">{row.reorderPoint}</td>
                <td className="py-5 px-6 text-sm font-semibold text-gray-500 cursor-pointer hover:text-gray-900 transition-colors">
                  View Details
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}