import React, { useContext, useEffect, useState } from 'react'
import './collection.css'
import { ShopContext } from '../../context/shopContext'
import { assets } from '../../assets/assets';
import Title from '../../components/title/Title';
import ProductItems from '../../components/productItems/ProductItems';

export default function Collection() {
  const { products,search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false)
  const [filterProduct, setFilterProduct] = useState([])
const [category,setCategory] = useState([]);
const [subCategory,setSubCategory]= useState([])
const [sortType, setSortType] = useState('normal')
 
console.log("🔍 search =", search);
  const toggleCategory = (e)=>{
    if(category.includes(e.target.value)){
      setCategory(prev=>prev.filter(item =>item !== e.target.value))
    }
    else {
      setCategory(prev=>[...prev,e.target.value])
    }
  }
  const toggleSubCategory = (e)=>{
    if(subCategory.includes(e.target.value)){
      setSubCategory(prev=>prev.filter(item =>item !== e.target.value))
    }
    else {
      setSubCategory(prev=>[...prev,e.target.value])
    }
  }

  const applyFilter = () => {
    let productsCopy = [...products];
  
    // 🔍 Recherche texte
    if (showSearch && search) {
      productsCopy = productsCopy.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
  
    // 📂 Filtrage par catégorie
    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }
  
    // 📂 Filtrage par sous-catégorie
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
    }
  
    setFilterProduct(productsCopy);
  };
  



 const sortProducts = () =>{
  let filtercProductCopy = filterProduct.slice();

  switch (sortType) {
    case 'petit-grand':
      setFilterProduct(filtercProductCopy.sort((a,b)=> (a.price - b.price)))
      break;
      
  
    case 'grand-petit':
    setFilterProduct(filtercProductCopy.sort((a,b)=> ( b.price  - a.price )))
    break;
   
    default:
      applyFilter();
      break;
  }
 }

 useEffect(()=>{
  applyFilter();
 },[category,subCategory,search,showSearch,products])

 useEffect(()=>{
  sortProducts();
 },[sortType])
  return (
    <div className="collection">
      <div className="filter-wrapper">
        <p className="filter-title" onClick={() => setShowFilter(!showFilter)}>FILTER
          <img src={assets.dropdown_icon} className={`dropdown-icon ${showFilter ? 'rotated' : ''}`} />
        </p>
        {/* category filter*/}
        <div className={`category-filter ${showFilter ? '' : 'hidden'}`}>
          <p className="category-title">CATEGORIES</p>
          <div className="category-options">
            <p>
              <input className="checkbox" type="checkbox" value="Men" onClick={toggleCategory} /> Men
            </p>
            <p>
              <input className="checkbox" type="checkbox" value="Women" onClick={toggleCategory} /> Women
            </p>
            <p>
              <input className="checkbox" type="checkbox" value="Kids" onClick={toggleCategory} /> Kids
            </p>
          </div>
        </div>

        {/*Sub category filter*/}

        <div className={`category-filter ${showFilter ? '' : 'hidden'}`}>
          <p className="category-title">TYPE</p>
          <div className="category-options">
            <p>
              <input className="checkbox" type="checkbox" value="Topwear" onClick={toggleSubCategory} /> Topwear
            </p>
            <p>
              <input className="checkbox" type="checkbox" value="Bottomwear" onClick={toggleSubCategory} /> Bottomwear
            </p>
            <p>
              <input className="checkbox" type="checkbox" value="Winterwear" onClick={toggleSubCategory} /> Winterwear
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE*/}
      <div className='right-side'>
        <div className='header'>
          <Title text1={"ALL"} text2={'COLLECTION'} />
          {/* product sort */}
          <select onChange={(e)=>setSortType(e.target.value)} className='sort-select'>
            <option value='normal'>Reinitialisez</option>
            <option value='petit-grand'>Triez du: Petit au Grand</option>
            <option value='grand-petit'>Triez du: Grand au Petit</option>
          </select>
        </div>
        <div className="products-container">
          {filterProduct.map((item, index) => {
  const price = Array.isArray(item.sizes) && item.sizes.length > 0
    ? item.sizes[0].price
    : item.price;

  return (
    <div className="product-item-wrapper" key={index}>
      <ProductItems
        name={item.name}
        id={item._id}
        price={price}
        image={item.image}
      />
    </div>
  );
})}

        </div>
      </div>
    </div>
  );
}
