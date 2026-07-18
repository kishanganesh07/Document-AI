import Document from '../models/Document.js';

// Get all documents (with optional filters)
export const getDocuments = async (req, res) => {
  try {
    const { search, documentType, status, page = 1, pageSize = 10 } = req.query;
    
    // We fetch documents belonging to the logged-in user
    let query = { ownerId: req.user.id };
    
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
    const document = await Document.findOne({ _id: req.params.id, ownerId: req.user.id });
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
    
    const ownerId = req.user.id;

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
    const updatedDoc = await Document.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user.id }, 
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
    const deletedDoc = await Document.findOneAndDelete({ _id: req.params.id, ownerId: req.user.id });
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
    const totalDocuments = await Document.countDocuments({ ownerId: req.user.id });
    const drafts = await Document.countDocuments({ ownerId: req.user.id, status: 'draft' });
    
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
