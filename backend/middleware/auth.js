import jwt from "jsonwebtoken";

function verifyToken(req, res, next) {
    // Token comes in header: "Bearer eyJhbG..."
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // get part after "Bearer "

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // attach user info to request
        next();             // move to next handler
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

export default verifyToken;