import { useState, useEffect, useCallback } from 'react';
import { Upload, Trash2, FileText, AlertCircle, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants, type ButtonProps } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from 'axios';
import { useAuth } from '../contexts/AuthProvider';
import { FileUp } from 'lucide-react';
import { Label } from '@/components/ui/label';

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
      const response = await axios.get('http://localhost:5002/list_documents');
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
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are supported.');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.post('http://localhost:5002/add_document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        }
      });

      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      // Refresh document list
      fetchDocuments();
    } catch (err: any) {
      console.error('Error uploading document:', err);
      setError(err.response?.data?.detail || 'Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const confirmDelete = (filename: string) => {
    setDocumentToDelete(filename);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!documentToDelete) return;
    
    try {
      await axios.delete(`http://localhost:5002/delete_document/${documentToDelete}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Close dialog and refresh list
      setDeleteConfirmOpen(false);
      setDocumentToDelete(null);
      fetchDocuments();
    } catch (err: any) {
      console.error('Error deleting document:', err);
      setError(err.response?.data?.detail || 'Failed to delete document. Please try again.');
    }
  };

  // Group documents by source
  const documentsBySource: Record<string, Document[]> = {};
  documents.forEach(doc => {
    if (!documentsBySource[doc.source]) {
      documentsBySource[doc.source] = [];
    }
    documentsBySource[doc.source].push(doc);
  });

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Document Management</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>Upload PDF documents to be used for answering questions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <Input
              id="file-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            {selectedFile && (
              <p className="text-sm">Selected: {selectedFile.name}</p>
            )}
            {isUploading && (
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
            {error && (
              <div className="flex items-center text-destructive text-sm">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading}
            className="flex items-center"
          >
            <FileUp className="mr-2 h-4 w-4" />
            {isUploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </CardFooter>
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
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              {error}
            </div>
          ) : Object.keys(documentsBySource).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No documents uploaded yet.
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(documentsBySource).map(([source, docs]) => (
                <div key={source} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      <h3 className="font-medium">{source}</h3>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => confirmDelete(source)}
                      className="h-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {docs.length} {docs.length === 1 ? 'page' : 'pages'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
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