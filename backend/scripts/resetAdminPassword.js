const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://127.0.0.1:27017/NutriTrack').then(async () => {
    const newPassword = 'admin@123';
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    const result = await mongoose.connection.db.collection('users').updateOne(
        { email: 'admin@test.com' },
        { $set: { password: hashed } }
    );

    if (result.modifiedCount > 0) {
        console.log('SUCCESS: Admin password reset to:', newPassword);
    } else {
        console.log('ERROR: Admin not found');
    }

    // Show admin details
    const admin = await mongoose.connection.db.collection('users').findOne(
        { email: 'admin@test.com' },
        { projection: { password: 0 } }
    );
    console.log('Admin account:', JSON.stringify(admin, null, 2));

    process.exit(0);
}).catch(e => { console.error(e.message); process.exit(1); });
