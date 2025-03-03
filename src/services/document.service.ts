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

  getDocumentById: async (id: number): Promise<Document | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockDocuments.find(doc => doc.id === id);
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

  updateDocument: async (id: number, updates: Partial<Omit<Document, 'id' | 'createdAt'>>): Promise<Document> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockDocuments.findIndex(doc => doc.id === id);
    if (index === -1) {
      throw new Error('Document not found');
    }

    const updatedDoc = {
      ...mockDocuments[index],
      ...updates
    };

    mockDocuments[index] = updatedDoc;
    return updatedDoc;
  },

  deleteDocument: async (id: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockDocuments = mockDocuments.filter(doc => doc.id !== id);
  }
}; 