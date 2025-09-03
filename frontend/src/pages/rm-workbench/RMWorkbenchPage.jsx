import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, DollarSign, TrendingUp, AlertTriangle, Plus, Search, Filter, MoreHorizontal, Phone, Mail, Calendar, FileText } from 'lucide-react';

const RMWorkbenchPage = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for RM Workbench
  const rmData = {
    overview: {
      totalClients: 156,
      totalAUM: 4300000,
      monthlyGrowth: 8.2,
      activeProposals: 12,
      pendingTasks: 8,
      complianceAlerts: 3
    },
    clients: [
      {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1 (555) 123-4567',
        aum: 1200000,
        riskTolerance: 'Moderate',
        lastContact: '2024-01-20',
        status: 'Active',
        compliance: 'Compliant',
        portfolioReturn: 12.5,
        nextReview: '2024-02-15'
      },
      {
        id: 2,
        name: 'Emily Johnson',
        email: 'emily.johnson@email.com',
        phone: '+1 (555) 234-5678',
        aum: 850000,
        riskTolerance: 'Conservative',
        lastContact: '2024-01-18',
        status: 'Active',
        compliance: 'Review Required',
        portfolioReturn: 8.3,
        nextReview: '2024-02-10'
      },
      {
        id: 3,
        name: 'Michael Brown',
        email: 'michael.brown@email.com',
        phone: '+1 (555) 345-6789',
        aum: 2100000,
        riskTolerance: 'Aggressive',
        lastContact: '2024-01-22',
        status: 'Active',
        compliance: 'Compliant',
        portfolioReturn: 15.7,
        nextReview: '2024-02-20'
      }
    ],
    tasks: [
      { id: 1, client: 'John Smith', task: 'Quarterly Review', priority: 'High', dueDate: '2024-01-25' },
      { id: 2, client: 'Emily Johnson', task: 'KYC Update', priority: 'Medium', dueDate: '2024-01-28' },
      { id: 3, client: 'Michael Brown', task: 'Portfolio Rebalancing', priority: 'Low', dueDate: '2024-02-01' }
    ],
    proposals: [
      { id: 1, client: 'John Smith', type: 'Portfolio Optimization', status: 'Pending Review', value: 50000 },
      { id: 2, client: 'Emily Johnson', type: 'Risk Assessment', status: 'Approved', value: 25000 },
      { id: 3, client: 'Michael Brown', type: 'Tax Strategy', status: 'In Progress', value: 75000 }
    ],
    performance: [
      { month: 'Jul', aum: 3800000, clients: 148, revenue: 38000 },
      { month: 'Aug', aum: 3950000, clients: 151, revenue: 39500 },
      { month: 'Sep', aum: 4100000, clients: 153, revenue: 41000 },
      { month: 'Oct', aum: 4200000, clients: 154, revenue: 42000 },
      { month: 'Nov', aum: 4250000, clients: 155, revenue: 42500 },
      { month: 'Dec', aum: 4300000, clients: 156, revenue: 43000 }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceColor = (compliance) => {
    switch (compliance) {
      case 'Compliant': return 'bg-green-100 text-green-800';
      case 'Review Required': return 'bg-yellow-100 text-yellow-800';
      case 'Non-Compliant': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">RM Workbench</h1>
          <p className="text-gray-600">Comprehensive relationship manager tools and client management</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search Clients
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rmData.overview.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              Active client accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total AUM</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${(rmData.overview.totalAUM / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">
              Assets under management
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{rmData.overview.monthlyGrowth}%</div>
            <p className="text-xs text-muted-foreground">
              AUM growth this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Proposals</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{rmData.overview.activeProposals}</div>
            <p className="text-xs text-muted-foreground">
              Pending client proposals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{rmData.overview.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">
              Tasks requiring attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rmData.overview.complianceAlerts}</div>
            <p className="text-xs text-muted-foreground">
              Issues requiring review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clients">Client Management</TabsTrigger>
          <TabsTrigger value="tasks">Tasks & Activities</TabsTrigger>
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AUM Growth Trend</CardTitle>
                <CardDescription>Assets under management over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={rmData.performance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${(value / 1000000).toFixed(1)}M`, 'AUM']} />
                    <Line type="monotone" dataKey="aum" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest client interactions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Portfolio review completed for John Smith</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New client onboarded: Michael Brown</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">KYC documentation pending for Emily Johnson</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Portfolio</CardTitle>
              <CardDescription>Manage your client relationships and portfolios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rmData.clients.map((client) => (
                  <div key={client.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{client.name}</h3>
                          <Badge className={getStatusColor(client.status)} size="sm">
                            {client.status}
                          </Badge>
                          <Badge className={getComplianceColor(client.compliance)} size="sm">
                            {client.compliance}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">AUM:</span>
                            <p className="font-medium">${(client.aum / 1000000).toFixed(1)}M</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Risk Tolerance:</span>
                            <p className="font-medium">{client.riskTolerance}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Portfolio Return:</span>
                            <p className="font-medium text-green-600">+{client.portfolioReturn}%</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Next Review:</span>
                            <p className="font-medium">{client.nextReview}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>{client.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{client.phone}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tasks & Activities</CardTitle>
              <CardDescription>Manage your daily tasks and client activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rmData.tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium">{task.task}</h3>
                        <Badge className={getPriorityColor(task.priority)} size="sm">
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Client: {task.client}</p>
                        <p>Due: {task.dueDate}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Complete</Button>
                      <Button size="sm" variant="outline">Reschedule</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proposals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Proposals</CardTitle>
              <CardDescription>Track and manage client proposals and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rmData.proposals.map((proposal) => (
                  <div key={proposal.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium">{proposal.type}</h3>
                        <Badge className={getStatusColor(proposal.status)} size="sm">
                          {proposal.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Client: {proposal.client}</p>
                        <p>Value: ${proposal.value.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">View</Button>
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm">Send</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Growth</CardTitle>
                <CardDescription>Client acquisition over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={rmData.performance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="clients" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue generation</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={rmData.performance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RMWorkbenchPage;

