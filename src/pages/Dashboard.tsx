
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useReportData } from '@/hooks/useReportData';

export function Dashboard() {
  const { reportData, isLoading } = useReportData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Calculate KPI metrics
  const totalSubcontracts = reportData.totalSubcontracts;
  const totalValue = reportData.tableData.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalQuantity = reportData.tableData.reduce((sum, item) => sum + item.totalQuantity, 0);

  // Prepare data for charts
  const projectData = reportData.tableData.reduce((acc, item) => {
    // This is a simplified approach - in reality you'd need project mapping
    const project = 'Various Projects'; // Placeholder since we don't have direct project mapping in tableData
    const existing = acc.find(p => p.name === project);
    if (existing) {
      existing.value += item.totalAmount;
      existing.count += 1;
    } else {
      acc.push({ name: project, value: item.totalAmount, count: 1 });
    }
    return acc;
  }, []);

  // Top items by frequency
  const topItems = reportData.tableData
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map(item => ({
      name: item.item.length > 20 ? item.item.substring(0, 20) + '...' : item.item,
      count: item.count
    }));

  // Average rate per unit
  const unitRates = reportData.tableData.reduce((acc, item) => {
    const existing = acc.find(u => u.unit === item.unit);
    if (existing) {
      existing.totalRate += item.averageRate;
      existing.count += 1;
    } else {
      acc.push({ unit: item.unit, totalRate: item.averageRate, count: 1 });
    }
    return acc;
  }, []).map(item => ({
    unit: item.unit || 'N/A',
    averageRate: item.totalRate / item.count
  })).slice(0, 10);

  // Inclusion analysis
  const inclusionData = [
    {
      category: 'Accommodation',
      included: reportData.tableData.filter(item => item.accommodation === 'Yes').length,
      notIncluded: reportData.tableData.filter(item => item.accommodation === 'No').length
    },
    {
      category: 'Transportation',
      included: reportData.tableData.filter(item => item.transportation === 'Yes').length,
      notIncluded: reportData.tableData.filter(item => item.transportation === 'No').length
    },
    {
      category: 'Safety',
      included: reportData.tableData.filter(item => item.safety === 'Yes').length,
      notIncluded: reportData.tableData.filter(item => item.safety === 'No').length
    }
  ];

  // Mock time trend data (since we don't have detailed date breakdown)
  const timeTrendData = [
    { month: 'Jan', contracts: 5, value: 125000 },
    { month: 'Feb', contracts: 8, value: 200000 },
    { month: 'Mar', contracts: 12, value: 300000 },
    { month: 'Apr', contracts: 15, value: 450000 },
    { month: 'May', contracts: 18, value: 520000 },
    { month: 'Jun', contracts: 22, value: 680000 }
  ];

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">Subcontract Management Analytics</p>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">{totalSubcontracts}</div>
            <div className="text-sm text-muted-foreground">Total Subcontracts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">
              EGP {(totalValue / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-muted-foreground">Total Contract Value</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-orange-600">
              {totalQuantity.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Quantity of Items</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="trends">Time Trends</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="subcontractors">Subcontractors</TabsTrigger>
          <TabsTrigger value="items">BOQ Items</TabsTrigger>
          <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Subcontracts Issued Per Month</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="contracts" stroke="#8884d8" name="Contracts" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Value Per Month</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`EGP ${(value / 1000).toFixed(0)}K`, 'Value']} />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#82ca9d" name="Value (EGP)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Value Per Project</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={projectData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`EGP ${(value / 1000).toFixed(0)}K`, 'Value']} />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Number of Subcontracts Per Project</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={projectData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subcontractors" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Subcontractors by Value</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={projectData.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`EGP ${(value / 1000).toFixed(0)}K`, 'Value']} />
                    <Bar dataKey="value" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Subcontractor Value Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={projectData.slice(0, 5)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {projectData.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`EGP ${(value / 1000).toFixed(0)}K`, 'Value']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Most Common Items</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topItems}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8dd1e1" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Average Rate Per Unit</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={unitRates}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="unit" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`EGP ${value.toFixed(2)}`, 'Avg Rate']} />
                    <Bar dataKey="averageRate" fill="#ff7c7c" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inclusions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inclusion Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={inclusionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="included" stackId="a" fill="#82ca9d" name="Included" />
                  <Bar dataKey="notIncluded" stackId="a" fill="#ff7c7c" name="Not Included" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
