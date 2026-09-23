const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://127.0.0.1:27017/NutriTrack').then(async () => {
    const db = mongoose.connection.db;

    // Step 1: List all users
    const allUsers = await db.collection('users').find({}).toArray();
    console.log('Current users:', allUsers.map(u => `${u.email} (${u.role})`));

    // Step 2: Keep admin@test.com as admin, remove all other users
    await db.collection('users').deleteMany({ email: { $ne: 'admin@test.com' } });
    console.log('Removed all non-admin users');

    // Step 3: Create 2 demo users
    const salt = await bcrypt.genSalt(10);
    const pass1 = await bcrypt.hash('user123', salt);
    const pass2 = await bcrypt.hash('user456', salt);

    await db.collection('users').insertMany([
        {
            name: 'Demo User One',
            email: 'user1@demo.com',
            password: pass1,
            role: 'user',
            fitnessGoal: 'Maintain Weight',
            dietaryPreference: 'Vegetarian',
            activityLevel: 'Moderately Active',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Demo User Two',
            email: 'user2@demo.com',
            password: pass2,
            role: 'user',
            fitnessGoal: 'Weight Loss',
            dietaryPreference: 'Non-Vegetarian',
            activityLevel: 'Lightly Active',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ]);
    console.log('Created 2 demo users: user1@demo.com (pass: user123), user2@demo.com (pass: user456)');

    // Step 4: Delete all meals, water, weight, goals (user-specific data)
    const mealsDel = await db.collection('meals').deleteMany({});
    const waterDel = await db.collection('waters').deleteMany({});
    const weightDel = await db.collection('weightlogs').deleteMany({});
    const goalsDel = await db.collection('goals').deleteMany({});
    console.log(`Cleared: meals=${mealsDel.deletedCount}, water=${waterDel.deletedCount}, weight=${weightDel.deletedCount}, goals=${goalsDel.deletedCount}`);

    // Step 5: Verify final state
    const finalUsers = await db.collection('users').find({}).project({ email: 1, role: 1, name: 1 }).toArray();
    console.log('\nFINAL DATABASE STATE:');
    finalUsers.forEach(u => console.log(` - [${u.role.toUpperCase()}] ${u.name} (${u.email})`));

    process.exit(0);
}).catch(e => {
    console.error(e.message);
    process.exit(1);
});
