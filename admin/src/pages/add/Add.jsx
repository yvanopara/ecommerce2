import React, { useState } from 'react'
import './add.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import {toast} from 'react-toastify'
import { backendUrl } from '../../App'

export default function Add({ token }) {
  // --- États images (8 max) ---
  const [images, setImages] = useState(Array(8).fill(null))

  // --- Champs produit ---
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('') // Prix global (optionnel si sizes définies)
  const [category, setCategory] = useState('Men')
  const [subCategory, setSubCategory] = useState('Topwear')
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([]) // tableau d'objets {size, price}

  // --- Gestion upload image ---
  const handleImageChange = (index, file) => {
    setImages(prev => {
      const newImages = [...prev]
      newImages[index] = file
      return newImages
    })
  }

  // --- Gestion checkbox & prix tailles ---
  const handleSizeCheck = (size, checked) => {
    if (checked) {
      setSizes(prev => [...prev, { size, price: '' }])
    } else {
      setSizes(prev => prev.filter(s => s.size !== size))
    }
  }

  const handleSizePriceChange = (size, newPrice) => {
    setSizes(prev =>
      prev.map(s => (s.size === size ? { ...s, price: newPrice } : s))
    )
  }

  // --- Validation simple avant envoi ---
  const validateForm = () => {
    if (!name.trim()) {
      toast.error('Le nom du produit est requis')
      return false
    }
    if (!description.trim()) {
      toast.error('La description est requise')
      return false
    }
    if (sizes.length > 0) {
      // Valider que chaque taille a un prix numérique valide
      for (const s of sizes) {
        if (!s.price || isNaN(parseFloat(s.price))) {
          toast.error(`Le prix pour la taille ${s.size} est invalide`)
          return false
        }
      }
    } else {
      // Si pas de tailles, valider le prix global
      if (!price || isNaN(parseFloat(price))) {
        toast.error('Le prix global est invalide')
        return false
      }
    }
    if (!images[0]) {
      toast.error('Au moins une image (image 1) est requise')
      return false
    }
    return true
  }

  // --- Envoi formulaire ---
  const onSubmitHandler = async (event) => {
  event.preventDefault();

  if (!validateForm()) return;

  try {
    const formData = new FormData();

    // Ajoutez les champs de base
    formData.append('name', name.trim());
    formData.append('description', description.trim());
    formData.append('category', category);
    formData.append('subCategory', subCategory);
    formData.append('bestseller', bestseller);

    // Gestion des prix
    if (sizes.length > 0) {
      // Vérifiez que toutes les tailles ont un prix valide
      const validSizes = sizes.map(size => ({
        size: size.size,
        price: parseFloat(size.price) || 0
      }));
      formData.append('sizes', JSON.stringify(validSizes));
    } else {
      // Prix global uniquement si pas de tailles
      formData.append('price', parseFloat(price) || 0);
    }

    // Ajout des images
    images.forEach((img, index) => {
  if (img) {
    formData.append(`image${index + 1}`, img); // Utilisez image1, image2, etc.
  }
});

    console.log("Données envoyées:", {
      name: name.trim(),
      description: description.trim(),
      category,
      subCategory,
      bestseller,
      sizes: sizes.length > 0 ? sizes : null,
      price: sizes.length === 0 ? parseFloat(price) : null,
      images: images.filter(img => img !== null)
    });

    const response = await axios.post(backendUrl + '/api/product/add',formData,{headers:{token}})
     

    if (response.data.success) {
      toast.success(response.data.message);
      // Reset du formulaire
      setName('');
      setDescription('');
      setPrice('');
      setCategory('Men');
      setSubCategory('Topwear');
      setBestseller(false);
      setSizes([]);
      setImages(Array(8).fill(null));
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    console.error("Erreur complète:", error);
    if (error.response) {
      console.error("Réponse d'erreur:", error.response.data);
      toast.error(`Erreur serveur: ${error.response.data.message || 'Format de données invalide'}`);
    } else {
      toast.error(`Erreur réseau: ${error.message}`);
    }
  }
};

  return (
    <form className="form-container" onSubmit={onSubmitHandler}>
      {/* Section upload images */}
      <div className="add-img-upload">
        <p className="upload-label">Upload Images (image 1 requise)</p>
        <div className="image-upload-row">
          {images.map((img, idx) => (
            <label key={idx} htmlFor={`image${idx + 1}`}>
              <img
                className="image-preview"
                src={img ? URL.createObjectURL(img) : assets.upload_area}
                alt={`image preview ${idx + 1}`}
              />
              <input
                type="file"
                id={`image${idx + 1}`}
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0]
                  handleImageChange(idx, file)
                }}
                {...(idx === 0 ? { required: true } : {})}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Nom produit */}
      <div className="form-group">
        <p className="label">Nom du produit</p>
        <input
          type="text"
          placeholder="Entrer le nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          required
        />
      </div>

      {/* Description */}
      <div className="form-group">
        <p className="label">Description</p>
        <textarea
          placeholder="Entrer la description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input"
          required
        />
      </div>

      {/* Catégorie, sous-catégorie, prix global */}
      <div className="row-group">
        <div className="select-group">
          <p className="label">Catégorie</p>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Men">Homme</option>
            <option value="Women">Femme</option>
            <option value="Kids">Enfants</option>
          </select>
        </div>

        <div className="select-group">
          <p className="label">Sous-catégorie</p>
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
          >
            <option value="Topwear">Hauts</option>
            <option value="Bottomwear">Bas</option>
            <option value="Winterwear">Vêtements d'hiver</option>
          </select>
        </div>

        <div className="price-group">
          <p className="label">Prix global (optionnel si tailles définies)</p>
          <input
            type="number"
            placeholder="Entrer le prix"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="price-input"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {/* Tailles & prix */}
      <div>
        <p className="label">Tailles & prix</p>
        <div className="sizes">
          {['S', 'M', 'L', 'XL', 'XXL'].map((size) => {
            const sizeObj = sizes.find((s) => s.size === size)
            return (
              <div key={size} className="size-price-row">
                <label>
                  <input
                    type="checkbox"
                    checked={!!sizeObj}
                    onChange={(e) => handleSizeCheck(size, e.target.checked)}
                  />
                  {size}
                </label>
                {sizeObj && (
                  <input
                    type="number"
                    placeholder={`Prix pour ${size}`}
                    value={sizeObj.price}
                    onChange={(e) =>
                      handleSizePriceChange(size, e.target.value)
                    }
                    className="size-price-input"
                    min="0"
                    step="0.01"
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Bestseller */}
      <div className="bestseller">
        <input
          type="checkbox"
          id="bestseller"
          checked={bestseller}
          onChange={() => setBestseller((prev) => !prev)}
        />
        <label htmlFor="bestseller">Ajouter aux bestsellers</label>
      </div>

      {/* Bouton submit */}
      <button type="submit" className="submit-btn">
        Ajouter
      </button>
    </form>
  )
}
