import 'dotenv/config';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

const names = [
  'Minh Tran', 'Linh Nguyen', 'Hieu Pham', 'Thu Le', 'Nam Vo',
  'Anh Dang', 'Bao Hoang', 'Chi Nguyen', 'Duc Tran', 'Yen Pham',
  'Alex Johnson', 'Sara Kim', 'Raj Patel', 'Emma Liu', 'James Park',
  'Anonymous', 'Anonymous', 'Anonymous',
];

const messages = [
  'Really impressive work for a group of students. The design is very clean.',
  'Love the animation on the hero section. Super smooth.',
  'Great portfolio, shows a lot of effort and collaboration.',
  'The about section is creative. The 3D background is a nice touch.',
  'Very professional for a university project. Well done!',
  'The project cards look great. Nice layout overall.',
  'Good work! Would love to see more projects added.',
  'The typewriter effect on the about page is satisfying to watch.',
  'Solid foundation. The dark theme works really well.',
  'Impressed by the attention to detail in the UI.',
  'The team section carousel is smooth and easy to use.',
  'Nice colour palette — the green and cream combination is elegant.',
  'The grain overlay adds a lot of character to the design.',
  'Really like how each team member has their own slide.',
  'Clean, minimal, professional. Exactly what a portfolio should be.',
  'The scroll animations feel premium.',
  'Great use of typography throughout the site.',
  'Stood out compared to other group portfolios I have seen.',
  'The CTA in the hero section is well placed.',
  'Would be even better with a contact form.',
];

async function seed() {
  console.log('Seeding 50 feedback entries…');
  const batch = db.batch();

  for (let i = 0; i < 50; i++) {
    const ref = db.collection('feedback').doc();
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    batch.set(ref, {
      name: names[Math.floor(Math.random() * names.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars — realistic for a portfolio
      createdAt: date.toISOString(),
    });
  }

  await batch.commit();
  console.log('Done — 50 entries written to Firestore.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
