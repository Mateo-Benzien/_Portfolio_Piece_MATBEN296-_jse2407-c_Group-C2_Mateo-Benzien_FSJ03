// pages/api/products/[id].js
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";

export default async function handler(req, res) {
  const { id } = req.query;
  
  try {
    const productRef = doc(db, "products", id);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ id: productSnap.id, ...productSnap.data() });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
}
