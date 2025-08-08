import { db } from '../services/db';

async function main() {
  console.log('🌱 Seeding database with real data...');

  // Create real neighborhoods in Kolkata
  const neighborhoods = [
    {
      name: 'Sector 2, Salt Lake',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700091',
      latitude: 22.5809,
      longitude: 88.4199,
      radius: 0.5
    },
    {
      name: 'Sector 1, Salt Lake',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700064',
      latitude: 22.5923,
      longitude: 88.4099,
      radius: 0.5
    },
    {
      name: 'Sector 3, Salt Lake',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700106',
      latitude: 22.5699,
      longitude: 88.4299,
      radius: 0.5
    },
    {
      name: 'Lake Town',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700089',
      latitude: 22.6049,
      longitude: 88.3999,
      radius: 0.5
    },
    {
      name: 'Bangur',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700055',
      latitude: 22.6149,
      longitude: 88.3899,
      radius: 0.5
    }
  ];

  console.log('🏘️ Creating neighborhoods...');
  const createdNeighborhoods = [];
  for (const neighborhood of neighborhoods) {
    // Check if neighborhood already exists
    const existing = await db.neighborhood.findFirst({
      where: { name: neighborhood.name }
    });
    
    if (existing) {
      createdNeighborhoods.push(existing);
      console.log(`✅ Neighborhood already exists: ${neighborhood.name}`);
    } else {
      const created = await db.neighborhood.create({
        data: neighborhood
      });
      createdNeighborhoods.push(created);
      console.log(`✅ Created neighborhood: ${neighborhood.name}`);
    }
  }

  // Create sample users with real Indian names
  const users = [
    {
      phone: '+919876543210',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      neighborhoodId: createdNeighborhoods[0].id,
      verified: true,
      trustScore: 85
    },
    {
      phone: '+919876543211',
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      neighborhoodId: createdNeighborhoods[0].id,
      verified: true,
      trustScore: 92
    },
    {
      phone: '+919876543212',
      name: 'Amit Patel',
      email: 'amit.patel@email.com',
      neighborhoodId: createdNeighborhoods[1].id,
      verified: true,
      trustScore: 78
    },
    {
      phone: '+919876543213',
      name: 'Sunita Reddy',
      email: 'sunita.reddy@email.com',
      neighborhoodId: createdNeighborhoods[0].id,
      verified: true,
      trustScore: 88
    },
    {
      phone: '+919876543214',
      name: 'Vikram Singh',
      email: 'vikram.singh@email.com',
      neighborhoodId: createdNeighborhoods[2].id,
      verified: true,
      trustScore: 76
    },
    {
      phone: '+919876543215',
      name: 'Deepayan Das',
      email: 'deepayandas42@gmail.com',
      neighborhoodId: createdNeighborhoods[0].id,
      verified: true,
      trustScore: 95,
      role: 'admin'
    }
  ];

  console.log('👥 Creating users...');
  const createdUsers = [];
  for (const user of users) {
    // Check if user already exists by phone or email
    const existingByPhone = await db.user.findFirst({
      where: { phone: user.phone }
    });
    
    const existingByEmail = user.email ? await db.user.findFirst({
      where: { email: user.email }
    }) : null;
    
    if (existingByPhone) {
      createdUsers.push(existingByPhone);
      console.log(`✅ User already exists (phone): ${user.name}`);
    } else if (existingByEmail) {
      createdUsers.push(existingByEmail);
      console.log(`✅ User already exists (email): ${user.name}`);
    } else {
      const created = await db.user.create({
        data: user
      });
      createdUsers.push(created);
      console.log(`✅ Created user: ${user.name}`);
    }
  }

  // Create real water schedules
  const waterSchedules = [
    {
      userId: createdUsers[0].id,
      neighborhoodId: createdNeighborhoods[0].id,
      startTime: new Date('2024-01-15T06:00:00'),
      endTime: new Date('2024-01-15T08:00:00'),
      waterPressure: 7,
      notes: 'Good water pressure in morning hours',
      verified: true
    },
    {
      userId: createdUsers[1].id,
      neighborhoodId: createdNeighborhoods[0].id,
      startTime: new Date('2024-01-15T18:00:00'),
      endTime: new Date('2024-01-15T20:00:00'),
      waterPressure: 8,
      notes: 'Evening supply is consistent',
      verified: true
    }
  ];

  console.log('💧 Creating water schedules...');
  for (const schedule of waterSchedules) {
    await db.waterSchedule.create({
      data: schedule
    });
    console.log(`✅ Created water schedule for ${schedule.startTime}`);
  }

  // Create real power outages
  const powerOutages = [
    {
      userId: createdUsers[1].id,
      neighborhoodId: createdNeighborhoods[0].id,
      startTime: new Date('2024-01-14T14:30:00'),
      endTime: new Date('2024-01-14T16:45:00'),
      isPlanned: false,
      reason: 'Unexpected transformer maintenance',
      verified: true
    },
    {
      userId: createdUsers[2].id,
      neighborhoodId: createdNeighborhoods[1].id,
      startTime: new Date('2024-01-16T10:00:00'),
      endTime: new Date('2024-01-16T12:00:00'),
      isPlanned: true,
      reason: 'Scheduled maintenance work',
      verified: true
    }
  ];

  console.log('⚡ Creating power outages...');
  for (const outage of powerOutages) {
    await db.powerOutage.create({
      data: outage
    });
    console.log(`✅ Created power outage: ${outage.reason}`);
  }

  // Create real lost and found items
  const lostItems = [
    {
      userId: createdUsers[2].id,
      neighborhoodId: createdNeighborhoods[0].id,
      title: 'Black Leather Wallet',
      description: 'Lost black leather wallet near City Center, contains driving license and debit cards',
      category: 'wallet',
      lostAt: new Date('2024-01-14T09:00:00'),
      lostLocation: 'Near City Center, Sector 2',
      reward: 500,
      status: 'lost'
    },
    {
      userId: createdUsers[3].id,
      neighborhoodId: createdNeighborhoods[1].id,
      title: 'Blue Umbrella',
      description: 'Lost blue folding umbrella at bus stop',
      category: 'umbrella',
      lostAt: new Date('2024-01-13T17:30:00'),
      lostLocation: 'Sector 1 Bus Stop',
      reward: 0,
      status: 'lost'
    }
  ];

  console.log('🔍 Creating lost items...');
  for (const item of lostItems) {
    await db.lostItem.create({
      data: item
    });
    console.log(`✅ Created lost item: ${item.title}`);
  }

  const foundItems = [
    {
      userId: createdUsers[0].id,
      neighborhoodId: createdNeighborhoods[0].id,
      title: 'Set of Keys',
      description: 'Found set of 3 keys with keychain near apartment complex',
      category: 'keys',
      foundAt: new Date('2024-01-14T11:00:00'),
      foundLocation: 'Apartment Complex Gate',
      status: 'available'
    },
    {
      userId: createdUsers[4].id,
      neighborhoodId: createdNeighborhoods[2].id,
      title: 'Mobile Phone',
      description: 'Found smartphone in black case near market area',
      category: 'phone',
      foundAt: new Date('2024-01-13T16:00:00'),
      foundLocation: 'Sector 3 Market',
      status: 'available'
    }
  ];

  console.log('🎯 Creating found items...');
  for (const item of foundItems) {
    await db.foundItem.create({
      data: item
    });
    console.log(`✅ Created found item: ${item.title}`);
  }

  // Create real skills
  const skills = [
    {
      userId: createdUsers[3].id,
      neighborhoodId: createdNeighborhoods[0].id,
      title: 'Mathematics Tuition',
      description: 'Experienced math teacher offering tuition for classes 8-10. Specialized in algebra and geometry.',
      category: 'education',
      skillLevel: 'expert',
      isOffering: true,
      isActive: true
    },
    {
      userId: createdUsers[0].id,
      neighborhoodId: createdNeighborhoods[0].id,
      title: 'Plumbing Services',
      description: 'Professional plumber available for all types of plumbing repairs and installations.',
      category: 'home_repair',
      skillLevel: 'expert',
      isOffering: true,
      isActive: true
    },
    {
      userId: createdUsers[2].id,
      neighborhoodId: createdNeighborhoods[1].id,
      title: 'Car Mechanic',
      description: 'Need help with car maintenance. Looking for reliable mechanic in the area.',
      category: 'automotive',
      skillLevel: 'beginner',
      isOffering: false,
      isActive: true
    }
  ];

  console.log('🛠️ Creating skills...');
  for (const skill of skills) {
    await db.skill.create({
      data: skill
    });
    console.log(`✅ Created skill: ${skill.title}`);
  }

  // Create real parking spots
  const parkingSpots = [
    {
      userId: createdUsers[4].id,
      neighborhoodId: createdNeighborhoods[2].id,
      title: 'Covered Parking Space',
      description: 'Secure covered parking space available 24/7. CCTV surveillance available.',
      address: 'Sector 3, Block A, Near Market',
      latitude: 22.5699,
      longitude: 88.4299,
      pricePerHour: 50,
      isAvailable: true,
      vehicleType: 'car',
      features: 'covered,security,cctv'
    },
    {
      userId: createdUsers[1].id,
      neighborhoodId: createdNeighborhoods[0].id,
      title: 'Open Parking',
      description: 'Open parking space available during daytime. Safe and convenient location.',
      address: 'Sector 2, Near City Center',
      latitude: 22.5809,
      longitude: 88.4199,
      pricePerHour: 30,
      isAvailable: true,
      vehicleType: 'bike',
      features: 'open,affordable'
    }
  ];

  console.log('🚗 Creating parking spots...');
  for (const spot of parkingSpots) {
    await db.parkingSpot.create({
      data: spot
    });
    console.log(`✅ Created parking spot: ${spot.title}`);
  }

  // Create real queue updates
  const queueUpdates = [
    {
      userId: createdUsers[0].id,
      neighborhoodId: createdNeighborhoods[0].id,
      locationName: 'SBI Bank, Sector 2',
      locationType: 'bank',
      currentNumber: 45,
      estimatedTime: 25
    },
    {
      userId: createdUsers[3].id,
      neighborhoodId: createdNeighborhoods[0].id,
      locationName: 'Apollo Pharmacy',
      locationType: 'pharmacy',
      currentNumber: 12,
      estimatedTime: 15
    }
  ];

  console.log('📋 Creating queue updates...');
  for (const update of queueUpdates) {
    await db.queueUpdate.create({
      data: update
    });
    console.log(`✅ Created queue update: ${update.locationName}`);
  }

  console.log('🎉 Database seeding completed successfully!');
  console.log('📊 Summary:');
  console.log(`   - Neighborhoods: ${createdNeighborhoods.length}`);
  console.log(`   - Users: ${createdUsers.length}`);
  console.log(`   - Water Schedules: ${waterSchedules.length}`);
  console.log(`   - Power Outages: ${powerOutages.length}`);
  console.log(`   - Lost Items: ${lostItems.length}`);
  console.log(`   - Found Items: ${foundItems.length}`);
  console.log(`   - Skills: ${skills.length}`);
  console.log(`   - Parking Spots: ${parkingSpots.length}`);
  console.log(`   - Queue Updates: ${queueUpdates.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });