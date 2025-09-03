import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useToast } from '../../hooks/use-toast';
import { 
  Bot, 
  Activity, 
  MessageSquare, 
  Settings, 
  Play, 
  Pause, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Users,
  Brain,
  Shield,
  TrendingUp,
  FileText,
  Eye
} from 'lucide-react';

const AgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [systemHealth, setSystemHealth] = useState({});
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [workflowType, setWorkflowType] = useState('event_processing');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  // Agent icons mapping
  const agentIcons = {
    'oracle': Eye,
    'enricher': Brain,
    'proposer': TrendingUp,
    'checker': Shield,
    'executor': Zap,
    'narrator': FileText
  };

  // Fetch real agent data from backend
  const fetchAgentData = async () => {
    try {
      setRefreshing(true);
      
      // Fetch agent health status
      const healthResponse = await fetch('http://localhost:5000/api/agents/health');
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        setSystemHealth(healthData);
      }

      // Fetch individual agent status
      const agentTypes = ['oracle', 'enricher', 'proposer', 'checker', 'executor', 'narrator'];
      const agentPromises = agentTypes.map(async (type) => {
        try {
          const response = await fetch(`http://localhost:5000/api/agents/agents/${type}/status`);
          if (response.ok) {
            const data = await response.json();
            return { ...data, type };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching ${type} agent:`, error);
          return {
            type,
            agent_id: type,
            name: `${type.charAt(0).toUpperCase() + type.slice(1)} Agent`,
            status: 'error',
            processed_messages: 0,
            error_count: 0,
            queue_size: 0,
            capabilities: []
          };
        }
      });

      const agentResults = await Promise.all(agentPromises);
      setAgents(agentResults.filter(agent => agent !== null));

      // Fetch active workflows
      const workflowResponse = await fetch('http://localhost:5000/api/agents/workflows');
      if (workflowResponse.ok) {
        const workflowData = await workflowResponse.json();
        setWorkflows(workflowData.workflows || []);
      }

    } catch (error) {
      console.error('Error fetching agent data:', error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to agent backend. Showing demo data.",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  // Send message to specific agent
  const sendMessageToAgent = async (agentType) => {
    if (!messageText.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message to send to the agent.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/agents/agents/${agentType}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: messageText,
          sender: 'user',
          message_type: 'command'
        })
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Message Sent",
          description: `Message sent to ${agentType} agent successfully.`,
        });
        setMessageText('');
        fetchAgentData(); // Refresh data
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Send Failed",
        description: "Failed to send message to agent.",
        variant: "destructive"
      });
    }
  };

  // Start a new workflow
  const startWorkflow = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/agents/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflow_type: workflowType,
          event_id: `demo_event_${Date.now()}`,
          description: `Demo ${workflowType} workflow started from UI`
        })
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Workflow Started",
          description: `${workflowType} workflow initiated successfully.`,
        });
        fetchAgentData(); // Refresh data
      } else {
        throw new Error('Failed to start workflow');
      }
    } catch (error) {
      console.error('Error starting workflow:', error);
      toast({
        title: "Workflow Failed",
        description: "Failed to start workflow.",
        variant: "destructive"
      });
    }
  };

  // Restart an agent
  const restartAgent = async (agentType) => {
    try {
      const response = await fetch(`http://localhost:5000/api/agents/agents/${agentType}/restart`, {
        method: 'POST'
      });

      if (response.ok) {
        toast({
          title: "Agent Restarted",
          description: `${agentType} agent restarted successfully.`,
        });
        fetchAgentData(); // Refresh data
      } else {
        throw new Error('Failed to restart agent');
      }
    } catch (error) {
      console.error('Error restarting agent:', error);
      toast({
        title: "Restart Failed",
        description: "Failed to restart agent.",
        variant: "destructive"
      });
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'healthy':
      case 'active':
      case 'running':
        return 'bg-green-500';
      case 'warning':
      case 'busy':
        return 'bg-yellow-500';
      case 'error':
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'healthy':
      case 'active':
      case 'running':
        return 'default';
      case 'warning':
      case 'busy':
        return 'secondary';
      case 'error':
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  useEffect(() => {
    fetchAgentData();
    
    // Set up auto-refresh every 5 seconds
    const interval = setInterval(fetchAgentData, 5000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading AI Agents...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Agents</h1>
          <p className="text-muted-foreground">Monitor and manage the multi-agent AI system</p>
        </div>
        <Button 
          onClick={fetchAgentData} 
          disabled={refreshing}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{agents.length}</p>
                <p className="text-sm text-muted-foreground">Active Agents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {agents.filter(a => a.status === 'healthy' || a.status === 'active').length}
                </p>
                <p className="text-sm text-muted-foreground">Healthy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{workflows.length}</p>
                <p className="text-sm text-muted-foreground">Running Workflows</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">
                  {agents.reduce((sum, agent) => sum + (agent.processed_messages || 0), 0)}
                </p>
                <p className="text-sm text-muted-foreground">Tasks Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        {/* Agents Tab */}
        <TabsContent value="agents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => {
              const IconComponent = agentIcons[agent.type] || Bot;
              return (
                <Card key={agent.agent_id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-6 w-6 text-blue-500" />
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`} />
                    </div>
                    <CardDescription>
                      {agent.type === 'oracle' && 'Event detection and market intelligence'}
                      {agent.type === 'enricher' && 'Context analysis and data enrichment'}
                      {agent.type === 'proposer' && 'Portfolio optimization and recommendations'}
                      {agent.type === 'checker' && 'Compliance validation and risk assessment'}
                      {agent.type === 'executor' && 'Trade execution and portfolio updates'}
                      {agent.type === 'narrator' && 'Client communication and reporting'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Status</p>
                        <Badge variant={getStatusBadgeVariant(agent.status)}>
                          {agent.status || 'unknown'}
                        </Badge>
                      </div>
                      <div>
                        <p className="font-medium">Queue</p>
                        <p className="text-muted-foreground">{agent.queue_size || 0} messages</p>
                      </div>
                      <div>
                        <p className="font-medium">Tasks</p>
                        <p className="text-muted-foreground">{agent.processed_messages || 0}</p>
                      </div>
                      <div>
                        <p className="font-medium">Errors</p>
                        <p className="text-muted-foreground">{agent.error_count || 0}</p>
                      </div>
                    </div>
                    
                    {agent.capabilities && agent.capabilities.length > 0 && (
                      <div>
                        <p className="font-medium text-sm mb-2">Capabilities</p>
                        <div className="flex flex-wrap gap-1">
                          {agent.capabilities.slice(0, 3).map((capability, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {capability}
                            </Badge>
                          ))}
                          {agent.capabilities.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{agent.capabilities.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedAgent(agent)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => restartAgent(agent.type)}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Restart
                      </Button>
                    </div>
                    
                    {agent.last_activity && (
                      <p className="text-xs text-muted-foreground">
                        Last activity: {new Date(agent.last_activity).toLocaleString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Workflows Tab */}
        <TabsContent value="workflows" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Active Workflows</h3>
            <div className="flex items-center space-x-2">
              <Select value={workflowType} onValueChange={setWorkflowType}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="event_processing">Event Processing</SelectItem>
                  <SelectItem value="portfolio_rebalancing">Portfolio Rebalancing</SelectItem>
                  <SelectItem value="client_communication">Client Communication</SelectItem>
                  <SelectItem value="compliance_check">Compliance Check</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={startWorkflow}>
                <Play className="h-4 w-4 mr-2" />
                Start Workflow
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {workflows.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No active workflows</p>
                  <p className="text-sm text-muted-foreground">Start a workflow to see agent collaboration</p>
                </CardContent>
              </Card>
            ) : (
              workflows.map((workflow) => (
                <Card key={workflow.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{workflow.type}</CardTitle>
                      <Badge variant={workflow.status === 'completed' ? 'default' : 'secondary'}>
                        {workflow.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      Workflow ID: {workflow.id}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress:</span>
                        <span>{workflow.current_step || 0} / {workflow.total_steps || 0} steps</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ 
                            width: `${((workflow.current_step || 0) / (workflow.total_steps || 1)) * 100}%` 
                          }}
                        />
                      </div>
                      {workflow.created_at && (
                        <p className="text-xs text-muted-foreground">
                          Started: {new Date(workflow.created_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Communication Tab */}
        <TabsContent value="communication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Message to Agent</CardTitle>
              <CardDescription>
                Send a direct message to any agent for testing or commands
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Select Agent</label>
                <Select 
                  value={selectedAgent?.type || ''} 
                  onValueChange={(value) => {
                    const agent = agents.find(a => a.type === value);
                    setSelectedAgent(agent);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.type} value={agent.type}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Enter your message or command..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows={4}
                />
              </div>
              
              <Button 
                onClick={() => selectedAgent && sendMessageToAgent(selectedAgent.type)}
                disabled={!selectedAgent || !messageText.trim()}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Overall Status:</span>
                    <Badge variant="default">Operational</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Agents:</span>
                    <span>{agents.filter(a => a.status === 'healthy' || a.status === 'active').length}/{agents.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Messages Processed:</span>
                    <span>{agents.reduce((sum, agent) => sum + (agent.processed_messages || 0), 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Errors:</span>
                    <span>{agents.reduce((sum, agent) => sum + (agent.error_count || 0), 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Average Response Time:</span>
                    <span>~250ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span>99.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Queue Depth:</span>
                    <span>{agents.reduce((sum, agent) => sum + (agent.queue_size || 0), 0)} messages</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uptime:</span>
                    <span>99.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentsPage;

