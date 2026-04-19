import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import productsData from '../data/products.json';

export const Buy = () => {
  const { productId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [address, setAddress] = useState('');

  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    const allProducts = storedProducts ? JSON.parse(storedProducts) : productsData;
    const foundProduct = allProducts.find(p => p.id === parseInt(productId));
    setProduct(foundProduct);
  }, [productId]);

  const handleBuy = (e) => {
    e.preventDefault();
    const order = {
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      price: product.discountPrice,
      username: user.username,
      email: user.email,
      address: address || user.address,
      status: 'Pending',
      date: new Date().toISOString(),
    };

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    alert('Order placed successfully!');
    navigate('/myorders');
  };

  if (!product) return <div style={styles.container}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h1>Complete Your Order</h1>
      <div style={styles.content}>
        <div style={styles.productInfo}>
          <img src={product.imageUrl} alt={product.name} style={styles.image} />
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <div style={styles.price}>
            <span style={styles.original}>₹{product.originalPrice}</span>
            <span style={styles.discount}>₹{product.discountPrice}</span>
          </div>
        </div>
        
        <form onSubmit={handleBuy} style={styles.form}>
          <h3>Delivery Details</h3>
          <div style={styles.field}>
            <label>Username:</label>
            <input type="text" value={user.username} disabled style={styles.input} />
          </div>
          <div style={styles.field}>
            <label>Email:</label>
            <input type="email" value={user.email} disabled style={styles.input} />
          </div>
          <div style={styles.field}>
            <label>Delivery Address:</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={styles.textarea}
              placeholder={user.address || "Enter your delivery address"}
            />
          </div>
          <button type="submit" style={styles.button}>Place Order</button>
        </form>
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
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    marginTop: '2rem',
  },
  productInfo: {
    border: '1px solid #ddd',
    padding: '1.5rem',
  },
  image: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    marginBottom: '1rem',
  },
  price: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    marginTop: '1rem',
  },
  original: {
    textDecoration: 'line-through',
    color: '#999',
  },
  discount: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    border: '1px solid #ddd',
    padding: '1.5rem',
  },
  field: {
    marginBottom: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    marginTop: '0.25rem',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '0.5rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    marginTop: '0.25rem',
    minHeight: '100px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    background: '#333',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};
