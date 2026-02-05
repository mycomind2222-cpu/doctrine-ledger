 import { useState, useMemo } from "react";
 import { motion } from "framer-motion";
 import { Search, Filter, X, Loader2 } from "lucide-react";
 import { Header } from "@/components/Header";
 import { Footer } from "@/components/Footer";
 import { IssueCard } from "@/components/IssueCard";
 import { SEO } from "@/components/SEO";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Skeleton } from "@/components/ui/skeleton";
 import { useAllIssues } from "@/hooks/useIssues";
 
 const Archive = () => {
   const { data: allIssues, isLoading } = useAllIssues();
   const [searchQuery, setSearchQuery] = useState("");
   const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
   const [selectedTag, setSelectedTag] = useState<string | null>(null);
   const [showFilters, setShowFilters] = useState(false);
 
   const themes = useMemo(() => 
     [...new Set((allIssues || []).map(i => i.theme))],
     [allIssues]
   );
   
   const allTags = useMemo(() => 
     [...new Set((allIssues || []).flatMap(i => i.tags))],
     [allIssues]
   );
 
   const filteredIssues = useMemo(() => {
     return (allIssues || []).filter(issue => {
      const matchesSearch = searchQuery === "" || 
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesTheme = !selectedTheme || issue.theme === selectedTheme;
      const matchesTag = !selectedTag || issue.tags.includes(selectedTag);
      
      return matchesSearch && matchesTheme && matchesTag;
     });
   }, [allIssues, searchQuery, selectedTheme, selectedTag]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTheme(null);
    setSelectedTag(null);
  };

  const hasActiveFilters = searchQuery || selectedTheme || selectedTag;

  return (
    <>
      <SEO
        title="Intelligence Archive"
        description="Browse all BLACKFILES intelligence briefings by theme, tag, or keyword. Complete index of doctrine-driven analysis."
        path="/archive"
      />
      <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mb-12"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-classified mb-2 block">
              Complete Index
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Archive
            </h1>
            <p className="text-muted-foreground">
              Browse all intelligence briefings by theme, tag, or keyword.
            </p>
          </motion.div>
          
          {/* Search and filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search issues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary border-border"
                />
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-classified rounded-full" />
                )}
              </Button>
              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters} className="gap-2">
                  <X className="w-4 h-4" />
                  Clear
                </Button>
              )}
            </div>
            
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-secondary/50 rounded-sm border border-border"
              >
                <div>
                  <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3 block">
                    Theme
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {themes.map(theme => (
                      <button
                        key={theme}
                        onClick={() => setSelectedTheme(selectedTheme === theme ? null : theme)}
                        className={`px-3 py-1.5 text-sm rounded-sm border transition-colors ${
                          selectedTheme === theme
                            ? 'bg-classified text-classified-foreground border-classified'
                            : 'bg-transparent border-border text-muted-foreground hover:text-foreground hover:border-foreground/50'
                        }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3 block">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                        className={`px-3 py-1.5 text-sm font-mono rounded-sm border transition-colors ${
                          selectedTag === tag
                            ? 'bg-classified text-classified-foreground border-classified'
                            : 'bg-transparent border-border text-muted-foreground hover:text-foreground hover:border-foreground/50'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
          
          {/* Results */}
          <div className="mb-8">
            <span className="font-mono text-xs text-muted-foreground">
              {filteredIssues.length} {filteredIssues.length === 1 ? 'issue' : 'issues'} found
            </span>
          </div>
          
           {isLoading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {Array.from({ length: 8 }).map((_, i) => (
                 <div key={i} className="space-y-3">
                   <Skeleton className="aspect-[3/4] w-full" />
                   <Skeleton className="h-4 w-3/4" />
                   <Skeleton className="h-3 w-1/2" />
                 </div>
               ))}
             </div>
           ) : filteredIssues.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {filteredIssues.map((issue, index) => (
                 <IssueCard key={issue.number} issue={issue} index={index} />
               ))}
             </div>
           ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">No issues match your criteria.</p>
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      </div>
    </>
  );
};

export default Archive;
