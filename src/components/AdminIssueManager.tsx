 import { useState } from "react";
 import { useAdminIssues, usePublishIssue, useUnpublishIssue, useDeleteIssue, useGenerateIssue } from "@/hooks/useIssues";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
 import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
 import { toast } from "sonner";
 import { Loader2, Sparkles, Eye, EyeOff, Trash2, FileText, Bot } from "lucide-react";
 
 export const AdminIssueManager = () => {
   const { data: issues, isLoading, error } = useAdminIssues();
   const publishMutation = usePublishIssue();
   const unpublishMutation = useUnpublishIssue();
   const deleteMutation = useDeleteIssue();
   const generateMutation = useGenerateIssue();
   const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; issueId: string; title: string }>({
     open: false,
     issueId: "",
     title: "",
   });
 
   const handleGenerate = async () => {
     try {
       const result = await generateMutation.mutateAsync();
       toast.success(`Generated Issue #${result.issue.number}: ${result.issue.title}`);
     } catch (err) {
       toast.error(err instanceof Error ? err.message : "Failed to generate issue");
     }
   };
 
   const handlePublish = async (id: string) => {
     try {
       await publishMutation.mutateAsync(id);
       toast.success("Issue published");
     } catch {
       toast.error("Failed to publish issue");
     }
   };
 
   const handleUnpublish = async (id: string) => {
     try {
       await unpublishMutation.mutateAsync(id);
       toast.success("Issue unpublished");
     } catch {
       toast.error("Failed to unpublish issue");
     }
   };
 
   const handleDelete = async () => {
     try {
       await deleteMutation.mutateAsync(deleteDialog.issueId);
       toast.success("Issue deleted");
       setDeleteDialog({ open: false, issueId: "", title: "" });
     } catch {
       toast.error("Failed to delete issue");
     }
   };
 
   if (error) {
     return (
       <div className="text-destructive p-4">
         Failed to load issues. You may not have admin access.
       </div>
     );
   }
 
   return (
     <div className="space-y-6">
       <div className="flex items-center justify-between">
         <div className="flex items-center gap-2">
           <FileText className="h-5 w-5 text-muted-foreground" />
           <h2 className="font-semibold">AI-Generated Issues</h2>
           <Badge variant="outline" className="ml-2">
             {issues?.length || 0} issues
           </Badge>
         </div>
         <Button
           onClick={handleGenerate}
           disabled={generateMutation.isPending}
           className="gap-2"
         >
           {generateMutation.isPending ? (
             <Loader2 className="h-4 w-4 animate-spin" />
           ) : (
             <Sparkles className="h-4 w-4" />
           )}
           Generate New Issue
         </Button>
       </div>
 
       <p className="text-sm text-muted-foreground">
         Issues are automatically generated every Monday at 6 AM UTC. You can also manually generate issues or manage existing ones below.
       </p>
 
       {isLoading ? (
         <div className="flex justify-center p-8">
           <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
         </div>
       ) : !issues?.length ? (
         <div className="text-center p-8 text-muted-foreground border border-dashed rounded-lg">
           <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
           <p>No AI-generated issues yet.</p>
           <p className="text-sm mt-1">Click "Generate New Issue" to create one.</p>
         </div>
       ) : (
         <Table>
           <TableHeader>
             <TableRow>
               <TableHead className="w-16">#</TableHead>
               <TableHead>Title</TableHead>
               <TableHead>Theme</TableHead>
               <TableHead>Status</TableHead>
               <TableHead>Publish Date</TableHead>
               <TableHead className="text-right">Actions</TableHead>
             </TableRow>
           </TableHeader>
           <TableBody>
             {issues.map((issue) => (
               <TableRow key={issue.id}>
                 <TableCell className="font-mono">{issue.number}</TableCell>
                 <TableCell className="font-medium max-w-[200px] truncate">
                   {issue.title}
                 </TableCell>
                 <TableCell>
                   <Badge variant="secondary">{issue.theme}</Badge>
                 </TableCell>
                 <TableCell>
                   <Badge
                     variant={issue.publication_status === "published" ? "default" : "outline"}
                   >
                     {issue.publication_status}
                   </Badge>
                 </TableCell>
                 <TableCell className="font-mono text-xs">
                   {new Date(issue.publish_date).toLocaleDateString()}
                 </TableCell>
                 <TableCell className="text-right space-x-2">
                   {issue.publication_status === "draft" ? (
                     <Button
                       size="sm"
                       variant="outline"
                       onClick={() => handlePublish(issue.id)}
                       disabled={publishMutation.isPending}
                     >
                       <Eye className="h-3 w-3 mr-1" />
                       Publish
                     </Button>
                   ) : (
                     <Button
                       size="sm"
                       variant="ghost"
                       onClick={() => handleUnpublish(issue.id)}
                       disabled={unpublishMutation.isPending}
                     >
                       <EyeOff className="h-3 w-3 mr-1" />
                       Unpublish
                     </Button>
                   )}
                   <Button
                     size="sm"
                     variant="ghost"
                     className="text-destructive hover:text-destructive"
                     onClick={() => setDeleteDialog({ open: true, issueId: issue.id, title: issue.title })}
                   >
                     <Trash2 className="h-3 w-3" />
                   </Button>
                 </TableCell>
               </TableRow>
             ))}
           </TableBody>
         </Table>
       )}
 
       <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Delete Issue</DialogTitle>
             <DialogDescription>
               Are you sure you want to delete "{deleteDialog.title}"? This action cannot be undone.
             </DialogDescription>
           </DialogHeader>
           <DialogFooter>
             <Button variant="ghost" onClick={() => setDeleteDialog({ open: false, issueId: "", title: "" })}>
               Cancel
             </Button>
             <Button
               variant="destructive"
               onClick={handleDelete}
               disabled={deleteMutation.isPending}
             >
               {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
               Delete
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>
     </div>
   );
 };