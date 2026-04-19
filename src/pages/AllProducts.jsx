import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productsData from '../data/products.json';

export const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    let allProducts = storedProducts ? JSON.parse(storedProducts) : productsData;
    
    if (filter === 'hot') {
      allProducts = allProducts.filter(p => p.isHot);
    } else if (filter === 'low') {
      allProducts = [...allProducts].sort((a, b) => a.discountPrice - b.discountPrice);
    } else if (filter === 'high') {
      allProducts = [...allProducts].sort((a, b) => b.discountPrice - a.discountPrice);
    }
    
    setProducts(allProducts);
  }, [filter]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>All Products</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={styles.select}>
          <option value="all">All Products</option>
          <option value="hot">Hot Products</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>
      <div style={styles.grid}>
        {products.map(product => (
          <div key={product.id} style={styles.card}>
            <img src={product.imageUrl} alt={product.name} style={styles.image} />
            <h3>{product.name}</h3>
            <p style={styles.description}>{product.description}</p>
            <div style={styles.price}>
              <span style={styles.original}>₹{product.originalPrice}</span>
              <span style={styles.discount}>₹{product.discountPrice}</span>
            </div>
            {!product.inStock && <span style={styles.outOfStock}>Out of Stock</span>}
            {product.isHot && <span style={styles.hotBadge}>HOT</span>}
            {product.inStock && (
              <Link to={`/buy/${product.id}`} style={styles.buyButton}>Buy Now</Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  select: {
    padding: '0.5rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    border: '1px solid #ddd',
    padding: '1rem',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  description: {
    color: '#666',
    fontSize: '0.875rem',
  },
  price: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    marginTop: '0.5rem',
  },
  original: {
    textDecoration: 'line-through',
    color: '#999',
  },
  discount: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#333',
  },
  outOfStock: {
    color: 'red',
    fontSize: '0.875rem',
    fontWeight: 'bold',
  },
  hotBadge: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: '#ff4444',
    color: '#fff',
    padding: '0.25rem 0.5rem',
    fontSize: '0.75rem',
    fontWeight: 'bold',
  },
  buyButton: {
    display: 'inline-block',
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    background: '#333',
    color: '#fff',
    textDecoration: 'none',
    textAlign: 'center',
  },
};
