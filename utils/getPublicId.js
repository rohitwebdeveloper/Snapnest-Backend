const getPublicIdFromUrl = (url) => {
  try {
 const parts = url.split('/upload/')[1];
  const path = parts.split('/').slice(1).join('/');
  const publicId = path.replace(/\.[^/.]+$/, ''); // remove extension
  return publicId
  } catch (err) {
    console.error('Invalid URL:', url);
    throw new Error('Failed to delete photo')
  }
};


module.exports = getPublicIdFromUrl