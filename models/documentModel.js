const mongoose = require('mongoose');
const DOCUMENT_CATEGORIES = [
  'Identity',
  'Payments',
  'Certificates',
  'Notes',
  'Receipts',
  'Events',
  'Reports',
  'Projects',
  'Legal'
];
const Photo = require('../models/photoModel')

const documentSchema = new mongoose.Schema(
  {
    photo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Photo',
      required: true
    },
    category: {
      type: String,
      enum: DOCUMENT_CATEGORIES,
      required: true
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Document', documentSchema);
