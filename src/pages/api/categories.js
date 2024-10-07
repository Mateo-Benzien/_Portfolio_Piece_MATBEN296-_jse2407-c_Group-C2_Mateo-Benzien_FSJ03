// pages/api/categories.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default async function handler(req, res) {
  try {
    const categoryRef = collection(db, "categories");
    const snapshot = await getDocs(categoryRef);

    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
}
