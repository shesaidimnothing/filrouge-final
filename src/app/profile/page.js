'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import PageTransition from '../../components/animations/PageTransition';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour du profil');
      }

      updateUser(data.user);

      setSuccess('Profil mis à jour avec succès');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      setError(error.message);
    }
  };

  if (!user) {
    return (
      <PageTransition>
        <div className="bg-black text-white min-h-screen pt-32">
          <div className="max-w-[1000px] mx-auto px-6 lg:px-12 py-20">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border border-white/20 border-t-white"></div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="bg-black text-white min-h-screen pt-32">
        <div className="max-w-[1000px] mx-auto px-6 lg:px-12 py-20">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-xl font-light tracking-wide mb-8">MON PROFIL</h1>

            {error && (
              <div className="border border-white/10 bg-red-500/10 text-white/60 px-4 py-3 mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="border border-white/10 bg-green-500/10 text-white/60 px-4 py-3 mb-6">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-light tracking-wide text-white/60 mb-2">
                  NOM
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/20 p-3 text-white placeholder-white/50 focus:border-white/50 transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-light tracking-wide text-white/60 mb-2">
                  EMAIL
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/20 p-3 text-white placeholder-white/50 focus:border-white/50 transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="currentPassword" className="block text-sm font-light tracking-wide text-white/60 mb-2">
                  MOT DE PASSE ACTUEL
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/20 p-3 text-white placeholder-white/50 focus:border-white/50 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-light tracking-wide text-white/60 mb-2">
                  NOUVEAU MOT DE PASSE
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/20 p-3 text-white placeholder-white/50 focus:border-white/50 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-light tracking-wide text-white/60 mb-2">
                  CONFIRMER LE NOUVEAU MOT DE PASSE
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/20 p-3 text-white placeholder-white/50 focus:border-white/50 transition-colors"
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full border border-white/20 px-8 py-3 text-sm hover:bg-white hover:text-black transition-colors duration-300"
                >
                  METTRE À JOUR
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
} 