import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if(token.startsWith("Bearer ")){
            token = token.replace("Bearer ", "").trim();
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(verified){
            req.user = verified;
            next();
        }
        else{
            return res.status(403).json({ message: "Access denied" });
        }
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}