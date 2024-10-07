// src/pages/api/products.js
import { db } from '../../lib/firebaseConfig';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import Fuse from 'fuse.js';

const productsPerPage = 10;

export default async function handler(req, res) {
  const { page = 1, search = '', category = '', sort = 'asc' } = req.query;

  const productsRef = collection(db, 'products');
  let q = query(productsRef, orderBy('price', sort === 'asc' ? 'asc' : 'desc'), limit(productsPerPage));

  if (category) {
    q = query(productsRef, where('category', '==', category), orderBy('price', sort === 'asc' ? 'asc' : 'desc'), limit(productsPerPage));
  }

  const snapshot = await getDocs(q);
  const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Filter using Fuse.js if search query is provided
  if (search) {
    const fuse = new Fuse(products, {
      keys: ['title'], // Change this to your product's searchable fields
      threshold: 0.3,
    });
    const results = fuse.search(search).map(result => result.item);
    return res.status(200).json({ products: results.slice((page - 1) * productsPerPage, page * productsPerPage), total: results.length });
  }

  return res.status(200).json({ products: products.slice((page - 1) * productsPerPage, page * productsPerPage), total: products.length });
}
