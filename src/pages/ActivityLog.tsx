import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { usePermissions } from '@/hooks/usePermissions';

interface AuditLog {
  id: string;
  user_id: string | null;
  action: 'insert' | 'update' | 'delete';
  entity: string;
  entity_id: string | null;
  before_snapshot: any;
  after_snapshot: any;
  created_at: string;
}

export function ActivityLog() {
  const { toast } = useToast();
  const { userRole } = usePermissions();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) {
      console.error('Failed to fetch audit logs', error);
      toast({ title: 'Error', description: 'Failed to load activity logs', variant: 'destructive' });
    } else {
      setLogs((data as any) || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, []);

  const filtered = useMemo(() => {
    return logs.filter(l =>
      (entityFilter === 'all' || l.entity === entityFilter) &&
      (actionFilter === 'all' || l.action === actionFilter) &&
      (!search || (l.entity_id?.toLowerCase().includes(search.toLowerCase()) || l.entity.toLowerCase().includes(search.toLowerCase())))
    );
  }, [logs, entityFilter, actionFilter, search]);

  const handleUndo = async (log: AuditLog) => {
    if (userRole !== 'admin') return;
    try {
      if (log.entity !== 'subcontracts') {
        toast({ title: 'Undo not available', description: 'Undo is currently supported for subcontracts only.' });
        return;
      }
      const { error } = await supabase.rpc('admin_undo_subcontract', { p_log_id: log.id });
      if (error) throw error;
      toast({ title: 'Undone', description: 'Action has been undone.' });
      fetchLogs();
    } catch (e: any) {
      console.error('Undo failed', e);
      toast({ title: 'Undo failed', description: e?.message || 'Could not undo action', variant: 'destructive' });
    }
  };

  const entities = ['all', 'subcontracts', 'subcontract_trade_items', 'subcontract_responsibilities', 'projects', 'subcontractors'];
  const actions = ['all', 'insert', 'update', 'delete'];

  return (
    <div>
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Activity Log</h1>
        <p className="text-sm text-muted-foreground">Track all changes across key entities. Admins can undo subcontract actions.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-medium">Entity</label>
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {entities.map(e => (<SelectItem key={e} value={e}>{e}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium">Action</label>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {actions.map(a => (<SelectItem key={a} value={a}>{a}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-medium">Search</label>
            <Input placeholder="Search by entity or ID" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="md:col-span-4 flex gap-2 justify-end">
            <Button variant="outline" onClick={fetchLogs} disabled={loading}>Refresh</Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 border rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 text-xs font-semibold px-4 py-2">
          <div className="col-span-3">Timestamp</div>
          <div className="col-span-2">User</div>
          <div className="col-span-2">Entity</div>
          <div className="col-span-2">Action</div>
          <div className="col-span-2">Entity ID</div>
          <div className="col-span-1 text-right">Undo</div>
        </div>
        <div className="divide-y">
          {filtered.map((log) => (
            <div key={log.id} className="grid grid-cols-12 px-4 py-2 items-center text-sm">
              <div className="col-span-3">{new Date(log.created_at).toLocaleString()}</div>
              <div className="col-span-2">{log.user_id ? log.user_id.slice(0,8) : 'system'}</div>
              <div className="col-span-2">{log.entity}</div>
              <div className="col-span-2 capitalize">{log.action}</div>
              <div className="col-span-2 truncate" title={log.entity_id || ''}>{log.entity_id || '-'}</div>
              <div className="col-span-1 text-right">
                {userRole === 'admin' && log.entity === 'subcontracts' && (
                  <Button size="sm" variant="outline" onClick={() => handleUndo(log)}>Undo</Button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-4 py-6 text-sm text-center text-muted-foreground">No activity found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActivityLog;
