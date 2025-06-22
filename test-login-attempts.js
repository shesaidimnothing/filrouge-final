const testLoginAttempts = async () => {
  const testEmail = 'test@example.com';
  const wrongPassword = 'wrongpassword';
  
  console.log('🧪 Test du système de limitation de tentatives de connexion');
  console.log('==================================================');
  
  // Test 1: Première tentative échouée
  console.log('\n1️⃣ Première tentative échouée...');
  try {
    const response1 = await fetch('http://localhost:3001/api/auth/login', {
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
  
  // Test 2: Deuxième tentative échouée
  console.log('\n2️⃣ Deuxième tentative échouée...');
  try {
    const response2 = await fetch('http://localhost:3001/api/auth/login', {
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
  
  // Test 3: Troisième tentative échouée (devrait bloquer)
  console.log('\n3️⃣ Troisième tentative échouée (devrait bloquer)...');
  try {
    const response3 = await fetch('http://localhost:3001/api/auth/login', {
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
  
  // Test 4: Tentative pendant le blocage
  console.log('\n4️⃣ Tentative pendant le blocage...');
  try {
    const response4 = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: wrongPassword })
    });
    const data4 = await response4.json();
    console.log('Status:', response4.status);
    console.log('Réponse:', data4);
  } catch (error) {
    console.error('Erreur:', error);
  }
  
  console.log('\n✅ Test terminé');
};

testLoginAttempts(); 