const asyncHandler = require('../utils/asyncHandler');
const Setting = require('../models/Setting');

const getSettingDocument = async () => {
  let setting = await Setting.findOne();
  if (!setting) setting = await Setting.create({});
  return setting;
};

const getSettings = asyncHandler(async (req, res) => {
  const setting = await getSettingDocument();
  res.json({ success: true, data: setting });
});

const updateSettings = asyncHandler(async (req, res) => {
  const setting = await getSettingDocument();
  Object.assign(setting, req.body);
  await setting.save();

  res.json({ success: true, data: setting });
});

module.exports = { getSettings, updateSettings };
