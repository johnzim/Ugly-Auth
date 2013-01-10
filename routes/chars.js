var characterArray = ["Mal", "Zoe", "Wash", "River", "Jane", "Simon", "Kaylee"];

exports.chars = function(req, res) {
  res.send('Responsy');
};

exports.char = function(req, res) {
  var charname = characterArray[req.params.id];
  res.send(charname);
};

