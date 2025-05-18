import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  console.log("Auth middleware triggered");
  
  const token = req.header("Authorization")?.split(" ")[1];
  console.log("Received token:", token);

  if (!token) {
    console.log("No token found");
    return res.status(401).json({ message: "Access Denied: No Token" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified:", verified);
    
    req.user = verified;
    next();
  } catch (err) {
    console.log("Invalid token:", err.message);
    res.status(403).json({ message: "Invalid or Expired Token" });
  }
};

const verifyToken = (roles = []) => (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied: ${roles.join(' or ')} only` });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export { auth, verifyToken };