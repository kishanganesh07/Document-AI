import Document from '../models/Document.js';

// Get all documents (with optional filters)
export const getDocuments = async (req, res) => {
  try {
    const { search, documentType, status, page = 1, pageSize = 10 } = req.query;
    
    // In a real app with auth, we would use req.user.id
    // For now, we fetch all or mock an ownerId
    let query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'documentData.clientName': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (documentType && documentType !== 'all') {
      query.documentType = documentType;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    const documents = await Document.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Document.countDocuments(query);

    res.json({
      data: documents,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get single document by ID
export const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Create a new document (e.g. from AI Generation)
export const createDocument = async (req, res) => {
  try {
    const { documentType, documentData, status, title } = req.body;
    
    // Mock user for now since auth might not be fully wired in frontend
    // In production: const ownerId = req.user._id;
    // We'll use a hardcoded valid ObjectId or create a dummy one for now.
    // Let's just create a dummy object id string for ownerId if not provided
    const ownerId = req.body.ownerId || '60d0fe4f5311236168a109ca'; // Mock valid ObjectId

    const newDoc = new Document({
      ownerId,
      documentType: documentType || 'unknown',
      title: title || (documentData?.clientName ? `${documentData.clientName} - ${documentType}` : `New ${documentType}`),
      status: status || 'draft',
      documentData: documentData || {}
    });

    const savedDoc = await newDoc.save();
    res.status(201).json(savedDoc);
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update a document
export const updateDocument = async (req, res) => {
  try {
    const updatedDoc = await Document.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!updatedDoc) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    res.json(updatedDoc);
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a document
export const deleteDocument = async (req, res) => {
  try {
    const deletedDoc = await Document.findByIdAndDelete(req.params.id);
    if (!deletedDoc) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalDocuments = await Document.countDocuments();
    const drafts = await Document.countDocuments({ status: 'draft' });
    
    // Mock chart data for now, or aggregate by date
    const chartData = Array.from({ length: 30 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return {
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        generated: Math.floor(Math.random() * 20) + 5
      };
    });

    res.json({
      totalDocuments,
      drafts,
      templatesUsed: 4,
      chartData
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server Error' });
  }
}
