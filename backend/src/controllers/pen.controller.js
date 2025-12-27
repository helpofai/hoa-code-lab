const Pen = require('../models/Pen.model');

exports.savePen = async (req, res) => {
  try {
    const { title, html, css, js, id } = req.body;
    const userId = req.user.id;

    if (id) {
      // Update existing pen
      const existingPen = await Pen.findById(id);
      if (!existingPen) return res.status(404).json({ message: 'Pen not found' });
      if (existingPen.user_id !== userId) return res.status(403).json({ message: 'Unauthorized' });

      await Pen.update(id, title, html, css, js);
      return res.json({ message: 'Pen updated successfully', id });
    } else {
      // Create new pen
      const newPenId = await Pen.create(userId, title, html, css, js);
      return res.status(201).json({ message: 'Pen created successfully', id: newPenId });
    }
  } catch (error) {
    console.error("Save Pen Error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserPens = async (req, res) => {
  try {
    const userId = req.user.id;
    const pens = await Pen.findByUserId(userId);
    res.json(pens);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPublicPens = async (req, res) => {
  try {
    const pens = await Pen.findAllPublic();
    res.json(pens);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTopRatedPens = async (req, res) => {
  try {
    const pens = await Pen.findAllTopRated();
    res.json(pens);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPenById = async (req, res) => {
  try {
    const penId = req.params.id;
    const pen = await Pen.findById(penId);
    if (!pen) return res.status(404).json({ message: 'Pen not found' });
    
    // Increment views asynchronously
    Pen.incrementViews(penId).catch(err => console.error("Error incrementing views:", err));
    
    res.json(pen);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deletePen = async (req, res) => {
  try {
    const userId = req.user.id;
    const pen = await Pen.findById(req.params.id);
    
    if (!pen) return res.status(404).json({ message: 'Pen not found' });
    if (pen.user_id !== userId) return res.status(403).json({ message: 'Unauthorized' });

    await Pen.delete(req.params.id);
    res.json({ message: 'Pen deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.likePen = async (req, res) => {
  try {
    await Pen.toggleLike(req.params.id);
    res.json({ message: 'Pen liked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.sharePen = async (req, res) => {
  try {
    await Pen.incrementShares(req.params.id);
    res.json({ message: 'Share count incremented' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
