const testLoginFix = async () => {
  const testEmail = 'test@example.com';
  const wrongPassword = 'wrongpassword';
  const correctPassword = 'password123'; // Assurez-vous que cet utilisateur existe
  
  console.log('🧪 Test de correction du système de blocage');
  console.log('==========================================');
  
  // Test 1: Créer un utilisateur de test (si nécessaire)
  console.log('\n1️⃣ Création d\'un utilisateur de test...');
  try {
    const createResponse = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: testEmail,
        password: correctPassword,
        consentMarketing: true,
        consentNewsletter: false
      })
    });
    
    if (createResponse.ok) {
      console.log('✅ Utilisateur créé avec succès');
    } else {
      const data = await createResponse.json();
      if (data.error && data.error.includes('déjà utilisé')) {
        console.log('ℹ️ Utilisateur déjà existant');
      } else {
        console.log('❌ Erreur création:', data);
      }
    }
  } catch (error) {
    console.log('ℹ️ Utilisateur probablement déjà existant');
  }
  
  // Test 2: Première tentative échouée
  console.log('\n2️⃣ Première tentative échouée...');
  try {
    const response1 = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: wrongPassword })
    });
    const data1 = await response1.json();
    console.log('Status:', response1.status);
    console.log('Réponse:', data1);
  } catch (error) {
    console.error('Erreur:', error);
  }
  
  // Test 3: Deuxième tentative échouée
  console.log('\n3️⃣ Deuxième tentative échouée...');
  try {
    const response2 = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: wrongPassword })
    });
    const data2 = await response2.json();
    console.log('Status:', response2.status);
    console.log('Réponse:', data2);
  } catch (error) {
    console.error('Erreur:', error);
  }
  
  // Test 4: Troisième tentative échouée (devrait bloquer)
  console.log('\n4️⃣ Troisième tentative échouée (devrait bloquer)...');
  try {
    const response3 = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: wrongPassword })
    });
    const data3 = await response3.json();
    console.log('Status:', response3.status);
    console.log('Réponse:', data3);
  } catch (error) {
    console.error('Erreur:', error);
  }
  
  // Test 5: Attendre 35 secondes pour que le blocage expire
  console.log('\n5️⃣ Attente de 35 secondes pour que le blocage expire...');
  await new Promise(resolve => setTimeout(resolve, 35000));
  console.log('✅ Attente terminée');
  
  // Test 6: Tentative avec le bon mot de passe après expiration du blocage
  console.log('\n6️⃣ Tentative avec le bon mot de passe après expiration...');
  try {
    const response6 = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: correctPassword })
    });
    const data6 = await response6.json();
    console.log('Status:', response6.status);
    console.log('Réponse:', data6);
    
    if (response6.ok) {
      console.log('✅ SUCCÈS : Connexion réussie après expiration du blocage');
    } else {
      console.log('❌ ÉCHEC : Connexion échouée après expiration du blocage');
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
  
  console.log('\n✅ Test terminé');
};

testLoginFix(); 