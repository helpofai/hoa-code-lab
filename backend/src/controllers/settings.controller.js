const Settings = require('../models/Settings.model');

exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.get();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    await Settings.update(req.body);
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings' });
  }
};
