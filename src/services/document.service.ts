import { Document } from '../types';

// Mock document data
let mockDocuments: Document[] = [
  {
    id: 1,
    title: 'Sample Document',
    content: 'This is a sample document content.',
    createdAt: new Date().toISOString()
  }
];

export const documentService = {
  getDocuments: async (): Promise<Document[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockDocuments];
  },

  addDocument: async (doc: Omit<Document, 'id' | 'createdAt'>): Promise<Document> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newDoc: Document = {
      ...doc,
      id: mockDocuments.length + 1,
      createdAt: new Date().toISOString()
    };
    
    mockDocuments.push(newDoc);
    return newDoc;
  },

  deleteDocument: async (id: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockDocuments = mockDocuments.filter(doc => doc.id !== id);
  }
}; 