
import React from 'react';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your subcontractor management system</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 border rounded-lg">
          <div className="text-2xl font-bold text-blue-600">24</div>
          <div className="text-sm text-muted-foreground">Active Subcontracts</div>
        </div>
        <div className="p-6 border rounded-lg">
          <div className="text-2xl font-bold text-green-600">EGP 2.5M</div>
          <div className="text-sm text-muted-foreground">Total Contract Value</div>
        </div>
        <div className="p-6 border rounded-lg">
          <div className="text-2xl font-bold text-orange-600">3</div>
          <div className="text-sm text-muted-foreground">Over Budget</div>
        </div>
        <div className="p-6 border rounded-lg">
          <div className="text-2xl font-bold text-purple-600">12</div>
          <div className="text-sm text-muted-foreground">Active Subcontractors</div>
        </div>
      </div>
    </div>
  );
}
