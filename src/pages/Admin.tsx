 import { useEffect, useState } from 'react';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { AdminIssueManager } from '@/components/AdminIssueManager';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Shield, Users, Loader2 } from 'lucide-react';
import type { AccessLevel } from '@/contexts/AuthContext';

interface UserRole {
  id: string;
  user_id: string;
  access_level: AccessLevel;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

const Admin = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch users');
      if (import.meta.env.DEV) console.error('Fetch users error:', error);
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  const updateAccessLevel = async (userId: string, newLevel: AccessLevel) => {
    setUpdating(userId);
    const { error } = await supabase
      .from('user_roles')
      .update({ access_level: newLevel })
      .eq('user_id', userId);

    if (error) {
      toast.error('Failed to update access level');
      if (import.meta.env.DEV) console.error('Update access level error:', error);
    } else {
      toast.success('Access level updated');
      setUsers(users.map(u => 
        u.user_id === userId ? { ...u, access_level: newLevel } : u
      ));
    }
    setUpdating(null);
  };

  const getAccessBadgeVariant = (level: AccessLevel) => {
    switch (level) {
      case 'restricted': return 'destructive';
      case 'professional': return 'default';
      default: return 'secondary';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

 
   return (
     <>
       <SEO
         title="Admin Panel"
         description="BLACKFILES administration panel for user access management."
         path="/admin"
       />
       <div className="min-h-screen bg-background flex flex-col">
         <Header />
         
         <main className="flex-1 container mx-auto px-4 py-8">
           <div className="max-w-5xl mx-auto">
             <div className="flex items-center gap-3 mb-6">
               <Shield className="h-8 w-8 text-primary" />
               <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
             </div>
 
             <Tabs defaultValue="issues" className="space-y-6">
               <TabsList>
                 <TabsTrigger value="issues">AI Issues</TabsTrigger>
                 <TabsTrigger value="users">User Access</TabsTrigger>
               </TabsList>
 
               <TabsContent value="issues">
                 <div className="rounded-lg border border-border bg-card p-6">
                   <AdminIssueManager />
                 </div>
               </TabsContent>
 
               <TabsContent value="users">
                 <div className="rounded-lg border border-border bg-card">
                   <div className="p-4 border-b border-border flex items-center gap-2">
                     <Users className="h-5 w-5 text-muted-foreground" />
                     <h2 className="font-semibold">User Access Management</h2>
                     <Badge variant="outline" className="ml-auto">
                       {users.length} users
                     </Badge>
                   </div>
 
                   {loading ? (
                     <div className="p-8 flex justify-center">
                       <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                     </div>
                   ) : users.length === 0 ? (
                     <div className="p-8 text-center text-muted-foreground">
                       No users found
                     </div>
                   ) : (
                     <Table>
                       <TableHeader>
                         <TableRow>
                           <TableHead>User ID</TableHead>
                           <TableHead>Current Access</TableHead>
                           <TableHead>Admin</TableHead>
                           <TableHead>Change Access</TableHead>
                         </TableRow>
                       </TableHeader>
                       <TableBody>
                         {users.map((userRole) => (
                           <TableRow key={userRole.id}>
                             <TableCell className="font-mono text-xs">
                               {userRole.user_id.slice(0, 8)}...
                             </TableCell>
                             <TableCell>
                               <Badge variant={getAccessBadgeVariant(userRole.access_level)}>
                                 {userRole.access_level}
                               </Badge>
                             </TableCell>
                             <TableCell>
                               {userRole.is_admin && (
                                 <Badge variant="outline" className="text-primary border-primary">
                                   Admin
                                 </Badge>
                               )}
                             </TableCell>
                             <TableCell>
                               <Select
                                 value={userRole.access_level}
                                 onValueChange={(value: AccessLevel) => 
                                   updateAccessLevel(userRole.user_id, value)
                                 }
                                 disabled={updating === userRole.user_id}
                               >
                                 <SelectTrigger className="w-32">
                                   <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent>
                                   <SelectItem value="public">Public</SelectItem>
                                   <SelectItem value="professional">Professional</SelectItem>
                                   <SelectItem value="restricted">Restricted</SelectItem>
                                 </SelectContent>
                               </Select>
                             </TableCell>
                           </TableRow>
                         ))}
                       </TableBody>
                     </Table>
                   )}
                 </div>
               </TabsContent>
             </Tabs>
           </div>
         </main>
 
         <Footer />
       </div>
     </>
   );
};

export default Admin;
