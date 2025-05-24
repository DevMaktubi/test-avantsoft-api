const app = require('./app');
const { db, User } = require('./models');
const bcrypt = require('bcryptjs');
const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await db.sync({ force: false });

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ where: { username: 'admin' } });
    
    if (!existingAdmin) {
      const hash = await bcrypt.hash('admin123', 10);
      await User.create({ username: 'admin', passwordHash: hash });
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }

    app.listen(PORT, () => console.log(`🟢 Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ Init error:', err);
  }
}

start();
