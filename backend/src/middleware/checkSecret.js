module.exports = function checkSecret(req, res, next) {
  const provided =
    req.headers["x-upload-secret"] || req.body?.uploadSecret || req.query?.uploadSecret;
  if (!provided || provided !== process.env.UPLOAD_SECRET) {
    return res.status(401).json({ error: "Invalid upload access code" });
  }
  next();
};
