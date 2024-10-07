// pages/api/products.js
import { collection, query, where, orderBy, limit, startAfter, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Fuse from "fuse.js";

export default async function handler(req, res) {
  try {
    const { page = 1, limit = 20, search = "", category = "", sort = "asc" } = req.query;

    const productRef = collection(db, "products");

    let q = query(productRef, orderBy("price", sort === "asc" ? "asc" : "desc"));

    if (category) {
      q = query(q, where("category", "==", category));
    }

    const snapshot = await getDocs(q);

    let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Apply search if needed
    if (search) {
      const fuse = new Fuse(products, { keys: ["title", "description"] });
      products = fuse.search(search).map(result => result.item);
    }

    // Pagination logic
    const paginatedProducts = products.slice((page - 1) * limit, page * limit);

    res.status(200).json(paginatedProducts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
}
