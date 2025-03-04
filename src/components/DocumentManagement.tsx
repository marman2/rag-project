import { useState, useEffect, useCallback } from 'react';
import { FileUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import axios from 'axios';
import { useAuth } from '../contexts/AuthProvider';

// Simple Progress component since we don't have the ui/progress module
const Progress = ({ value = 0, className = "" }: { value?: number, className?: string }) => {
  return (
    <div className={`w-full bg-muted rounded-full h-2 ${className}`}>
      <div 
        className="bg-primary h-full rounded-full transition-all duration-300" 
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

interface Document {
  source: string;
  page_number: string | number;
  content: string;
}

export const DocumentManagement = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  const { token } = useAuth();

  // Use useCallback to memoize the fetchDocuments function
  const fetchDocuments = useCallback(async () => {
    // Skip API call if we don't have a token yet
    if (!token) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get('http://backend:5000/list_documents');
      setDocuments(response.data.documents || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Only run the effect once when the component mounts or when token changes
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are supported');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !token) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      await axios.post('http://backend:5000/add_document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      });

      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      // Refresh document list
      fetchDocuments();
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const confirmDelete = (filename: string) => {
    setDocumentToDelete(filename);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!documentToDelete || !token) return;

    try {
      await axios.delete(`http://backend:5000/delete_document/${documentToDelete}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Remove from local state
      setDocuments(documents.filter(doc => doc.source !== documentToDelete));
      setDeleteConfirmOpen(false);
      setDocumentToDelete(null);
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Failed to delete document. Please try again.');
    }
  };

  // Group documents by source
  const groupedDocuments = documents.reduce((acc, doc) => {
    if (!acc[doc.source]) {
      acc[doc.source] = [];
    }
    acc[doc.source].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Document Management</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>Upload PDF documents to be used for question answering.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <input
                id="file-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
              />
              <div className="flex items-center gap-4">
                <label
                  htmlFor="file-upload"
                  className="flex h-10 w-full cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground"
                >
                  <FileUp className="mr-2 h-4 w-4" />
                  {selectedFile ? selectedFile.name : 'Select PDF file'}
                </label>
                <Button 
                  onClick={handleUpload} 
                  disabled={!selectedFile || isUploading}
                  className="w-24"
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </div>
            
            {isUploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="h-2 w-full" />
                <p className="text-xs text-muted-foreground text-right">{uploadProgress}%</p>
              </div>
            )}
            
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Documents</CardTitle>
          <CardDescription>Manage your uploaded documents.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              <p>{error}</p>
            </div>
          ) : Object.keys(groupedDocuments).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(groupedDocuments).map(([source, docs]) => (
                <div key={source} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{source}</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => confirmDelete(source)}
                    >
                      Delete
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {docs.length} page{docs.length !== 1 ? 's' : ''}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No documents found. Upload a document to get started.
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{documentToDelete}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 