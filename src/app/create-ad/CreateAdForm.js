'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

const CATEGORIES = [
  { id: 'immobilier', name: 'IMMOBILIER' },
  { id: 'vehicules', name: 'VÉHICULES' },
  { id: 'locations', name: 'LOCATIONS' },
  { id: 'emploi', name: 'EMPLOI' },
  { id: 'mode', name: 'MODE' },
  { id: 'maison', name: 'MAISON' },
  { id: 'multimedia', name: 'MULTIMÉDIA' },
  { id: 'loisirs', name: 'LOISIRS' },
  { id: 'autres', name: 'AUTRES' }
];

const inputClasses = "mt-2 block w-full bg-black border border-white/20 rounded-none px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors";
const labelClasses = "block text-sm font-light tracking-wide text-white/80";

export default function CreateAdForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border border-white/20 border-t-white"></div>
      </div>
    );
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('L\'image ne doit pas dépasser 5MB');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');
      formData.append('folder', 'samples/ecommerce');
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dihipijjs/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Erreur lors de l\'upload');
      }

      return data.secure_url;
    } catch (error) {
      throw new Error(`Erreur lors de l'upload de l'image: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError('');

    try {
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImageToCloudinary(image);
      }

      const response = await fetch('/api/ads', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          price: parseFloat(price),
          category,
          imageUrl
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      router.push('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {error && (
        <div className="border border-red-500/50 bg-red-500/10 text-red-500 px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className={labelClasses}>
            TITRE DE L'ANNONCE
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="description" className={labelClasses}>
            DESCRIPTION
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="6"
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="price" className={labelClasses}>
            PRIX (€)
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            step="0.01"
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="category" className={labelClasses}>
            CATÉGORIE
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className={inputClasses}
          >
            <option value="">Sélectionner une catégorie</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="image" className={labelClasses}>
            IMAGE
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <div 
            onClick={() => document.getElementById('image').click()}
            className="mt-2 border border-dashed border-white/20 p-8 text-center cursor-pointer hover:border-white/40 transition-colors"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Aperçu" className="max-h-48 mx-auto" />
            ) : (
              <div className="text-white/60">
                Cliquez pour ajouter une image
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full border border-white/20 px-8 py-4 text-sm hover:bg-white hover:text-black transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin rounded-full h-4 w-4 border border-b-2 border-white/20 mr-2"></span>
              PUBLICATION EN COURS...
            </span>
          ) : (
            'PUBLIER L\'ANNONCE'
          )}
        </button>
      </form>
    </div>
  );
} 