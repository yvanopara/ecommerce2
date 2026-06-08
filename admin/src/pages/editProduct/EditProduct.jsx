
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../../App';
import './editProduct.css';

export default function EditProduct({ token }) {

  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [utilisation, setUtilisation] = useState('');
  const [bestseller, setBestseller] = useState(false);

  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState(
    Array(8).fill(null)
  );

  const fetchProduct = async () => {

    try {

      const response =
        await axios.get(
          `${backendUrl}/api/product/single/${id}`
        );

      if (response.data.success) {

        const p =
          response.data.product;

        setName(p.name || '');
        setDescription(p.description || '');
        setDetails(p.details || '');
        setUtilisation(p.utilisation || '');
        setBestseller(p.bestseller || false);

        setImages(
          p.image || []
        );
      }

    } catch (error) {

      toast.error(
        'Erreur chargement produit'
      );

    } finally {

      setLoading(false);
    }
  };

  const removeImage = (index) => {

    const updatedImages =
      [...images];

    updatedImages[index] =
      null;

    setImages(
      updatedImages
    );
  };

  useEffect(() => {

    fetchProduct();

  }, []);

  const onSubmit = async (e) => {

    e.preventDefault();

    try {

      const formData =
        new FormData();

      formData.append(
        'id',
        id
      );

      formData.append(
        'name',
        name
      );

      formData.append(
        'description',
        description
      );

      formData.append(
        'details',
        details
      );

      formData.append(
        'utilisation',
        utilisation
      );

      formData.append(
        'bestseller',
        bestseller
      );

      formData.append(
        'existingImages',
        JSON.stringify(images)
      );

      newImages.forEach(
        (image, index) => {

          if (image) {

            formData.append(
              `image${index + 1}`,
              image
            );
          }
        }
      );

      const response =
        await axios.post(

          `${backendUrl}/api/product/update`,

          formData,

          {
            headers: {
              token
            }
          }
        );

      if (response.data.success) {

        toast.success(
          'Produit modifié'
        );

        fetchProduct();

      } else {

        toast.error(
          response.data.message
        );
      }

    } catch (error) {

      toast.error(
        error.message
      );
    }
  };

  if (loading) {

    return (
      <p>
        Chargement...
      </p>
    );
  }

  return (

    <form
      className="edit-product"
      onSubmit={onSubmit}
    >

      <h2>
        Modifier Produit
      </h2>

      <label>
        Nom
      </label>

      <input
        type="text"
        value={name}
        onChange={(e) =>
          setName(
            e.target.value
          )
        }
      />

      <label>
        Description
      </label>

      <textarea
        rows="5"
        value={description}
        onChange={(e) =>
          setDescription(
            e.target.value
          )
        }
      />

      <label>
        Détails
      </label>

      <textarea
        rows="5"
        value={details}
        onChange={(e) =>
          setDetails(
            e.target.value
          )
        }
      />

      <label>
        Utilisation
      </label>

      <textarea
        rows="5"
        value={utilisation}
        onChange={(e) =>
          setUtilisation(
            e.target.value
          )
        }
      />

      <label>

        <input
          type="checkbox"
          checked={bestseller}
          onChange={(e) =>
            setBestseller(
              e.target.checked
            )
          }
        />

        Bestseller

      </label>

      <div className="edit-images">

        {Array.from({
          length: 8
        }).map(
          (_, index) => (

            <div
              key={index}
            >

              {images[index] && (

                <div className="image-preview">

                  <img
                    src={images[index]}
                    alt=""
                  />

                  <button
                    type="button"
                    className="delete-image-btn"
                    onClick={() =>
                      removeImage(index)
                    }
                  >
                    🗑
                  </button>

                </div>
              )}

              <input
                type="file"
                onChange={(e) => {

                  const copy =
                    [...newImages];

                  copy[index] =
                    e.target.files[0];

                  setNewImages(
                    copy
                  );
                }}
              />

            </div>
          )
        )}

      </div>

      <button
        type="submit"
      >
        Enregistrer
      </button>

    </form>
  );
}

