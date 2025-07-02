const documentModel = require('../models/documentModel');
const { deleteOne } = require('../models/userModel');

const addDocument = async (req, res) => {
  const { photoId, category } = req.body;
  const userId = req.user._id; 

  if (!photoId || !category) {
    return res.status(400).json({ success: false, message: 'Photo ID and category are required' });
  }

  const newDocument = new documentModel({
    photo: photoId,
    category,
    addedBy: userId,
  });

  await newDocument.save();
  return res.status(201).json({ success: true, message: 'Document added successfully' });
};



const deleteDocument = async (req, res) => {
      const {documentId} = req.params
      const {_id} = req.user
  if (!documentId ) {
    return res.status(400).json({ success: false, message: 'Document id is required' });
  }

  const deletedDocument = await documentModel.deleteOne({_id:documentId, addedBy:_id})
   
  if(deletedDocument.deletedCount === 0) {
    return res.status(404).json({success:false, message:'Document not found or unauthorized'})
  }

  return res.status(200).json({success:true, message:'Document deleted'})
      
}



const getUserDocuments = async (req, res) => {
  const { category } = req.query;
  const userId = req.user._id;

  const filter = { addedBy: userId };
  if (category) filter.category = category;

  const documents = await documentModel.find(filter).populate('photo');

  return res.status(200).json({
    success: true,
    message: 'Documents fetched successfully',
    documents,
  });
};



module.exports = {
  addDocument,
  deleteDocument,
  getUserDocuments
};
