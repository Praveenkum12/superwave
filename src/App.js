import { createContext, useContext, useReducer } from 'react';
import ShoppingCart from './svg/shoppingCart';
import data from './Data';
import MagnifyGlass from './svg/magnifyGlass';

const useItem = function () {
  return useContext(ItemContext);
};

const reducer = function (state, action) {
  switch (action.type) {
    case 'updateInput':
      return { ...state, query: action.payload };
    case 'productMatched':
      return {
        ...state,
        matchedProducts: action.payload,
        status: action.payload.length ? 'showItems' : 'noItems',
      };
    case 'clickedCart':
      return { ...state, status: 'showCart' };
    case 'cartAdding':
      action.payload.finalPrice =
        action.payload.price * action.payload.quantity;

      return {
        ...state,
        cartArr: [action.payload, ...state.cartArr],
        totalPrice: state.totalPrice + action.payload.finalPrice,
      };
    default:
      throw new Error('Unknown Action');
  }
};

const initialState = {
  productList: data,
  query: '',
  matchedProducts: [],
  cartArr: [],
  status: 'initial',
  totalPrice: 0,
};
const ItemContext = createContext();

function App() {
  const [
    { productList, query, matchedProducts, status, cartArr, totalPrice },
    dispatch,
  ] = useReducer(reducer, initialState);

  return (
    <ItemContext.Provider
      value={{
        productList,
        query,
        dispatch,
        matchedProducts,
        status,
        cartArr,
        totalPrice,
      }}
    >
      <NavBar />
      <Main />
    </ItemContext.Provider>
  );
}

function NavBar() {
  const { query, dispatch, productList } = useItem();
  const handleInputChange = function (e) {
    dispatch({
      type: 'updateInput',
      payload: e.target.value,
    });
  };

  const handleSearch = () => {
    const matchingCategory = productList.find(
      category => Object.keys(category)[0].toLowerCase() === query.toLowerCase()
    );
    const products = matchingCategory
      ? matchingCategory[query.toLowerCase()]
      : [];
    dispatch({ type: 'productMatched', payload: products });
  };

  return (
    <nav className="nav">
      <span className="logo">ShopWave</span>
      <input
        type="text"
        placeholder="Search for products, brands and more"
        className="search-bar"
        value={query}
        onChange={handleInputChange}
      />
      <button className="search-btn" onClick={handleSearch}>
        <MagnifyGlass /> Search
      </button>
      <button
        className="cart-btn"
        onClick={() => dispatch({ type: 'clickedCart' })}
      >
        <ShoppingCart />
      </button>
    </nav>
  );
}

function Main() {
  const { matchedProducts, status, cartArr, totalPrice } = useItem();
  return (
    <main>
      {status === 'initial' && (
        <div className="no-product-cover">
          <div className="no-products">🌴 Discover Your Deserved Item 🌴</div>
        </div>
      )}
      {status === 'showItems' && (
        <section className="container">
          <h1 className="heading-product">Products</h1>
          <p className="para-product">Take a look at our products</p>
          <div className="fig-container">
            {matchedProducts.map(function (product) {
              return <Card key={product.id} product={product} />;
            })}
          </div>
        </section>
      )}
      {status === 'noItems' && (
        <div className="no-product-cover">
          <div className="no-products no-item">
            Unfortunately, there are no items <br /> to display at the moment 🥺
          </div>
        </div>
      )}
      {status === 'showCart' && (
        <section className="cart-container container">
          <h1 className="heading-cart">Your Cart</h1>
          <div className="carts-titles">
            <p>Product</p>
            <p>Unit price</p>
            <p>Quantity</p>
            <p>Total</p>
          </div>
          {cartArr.map(function (product) {
            return <CartItem key={product.id} product={product} />;
          })}
          <div className="total-box">
            <p>Total</p>
            <p className="total-price">Rs.{totalPrice} \-</p>
          </div>
        </section>
      )}
    </main>
  );
}

function CartItem({ product }) {
  return (
    <div className="cart-item">
      <p>
        <img
          className="sm-cart-img"
          src={product.image}
          alt={product.productName}
        />
        {product.productName}
      </p>
      <p>&#x20B9; {product.price}</p>
      <p>{product.quantity}</p>
      <p>Rs.{product.finalPrice} \-</p>
    </div>
  );
}

function Card({ product }) {
  const { dispatch } = useItem();

  function handleAddToCart() {
    dispatch({
      type: 'cartAdding',
      payload: product,
      quantity: 1,
    });
  }

  return (
    <figure className="cards">
      <div className="img-box">
        <img
          src={product.image}
          alt={product.productName}
          className="fig-img"
        />
      </div>
      <div className="fig-content">
        <h3 className="product-name">{product.productName}</h3>
        <p className="product-description">
          odio morbi quis commodo odio aenean sed adipiscing diam donec
        </p>
        <div className="cart-box">
          <button
            className="addToCart"
            onClick={handleAddToCart}
            // disabled={buttonDisabled}
          >
            Add To Cart
          </button>
          <p className="product-price">Rs.{product.price}\-</p>
        </div>
      </div>
    </figure>
  );
}

export default App;
