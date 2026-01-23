require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const Showtime = require('./models/Showtime');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const movies = [
    {
        title: "Dune: Part Two",
        description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.",
        poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
        featured: true,
        genre: "Sci-Fi / Adventure",
        duration: 166
    },
    {
        title: "Oppenheimer",
        description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb. A cinematic masterpiece exploring the depths of genius and the weight of consequence.",
        poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
        featured: true,
        genre: "Biography / Drama",
        duration: 180
    },
    {
        title: "Poor Things",
        description: "Brought back to life by an unorthodox scientist, a young woman runs off with a debauched lawyer on a whirlwind adventure across the continents. Free from the prejudices of her times, she grows steadfast in her purpose to stand for equality and liberation.",
        poster: "https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c5wMxc8.jpg",
        featured: false,
        genre: "Sci-Fi / Romance",
        duration: 141
    },
    {
        title: "The Godfather",
        description: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.",
        poster: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
        featured: true,
        genre: "Crime / Drama",
        duration: 175
    },
    {
        title: "Spider-Man: Across the Spider-Verse",
        description: "After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters the Spider Society, a team of Spider-People charged with protecting the Multiverse’s very existence.",
        poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
        featured: false,
        genre: "Animation / Action",
        duration: 140
    },
    {
        title: "Interstellar",
        description: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
        poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        featured: true,
        genre: "Sci-Fi / Adventure",
        duration: 169
    },
    {
        title: "Parasite",
        description: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
        poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
        featured: false,
        genre: "Thriller / Drama",
        duration: 132
    },
    {
        title: "The Dark Knight",
        description: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.",
        poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        featured: true,
        genre: "Action / Crime",
        duration: 152
    }
];

// Helper to generate next few days
const getDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 3; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
};

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('🌱 Seeding Gast Cinema Database...');

        // Clear existing
        await Movie.deleteMany({});
        await Showtime.deleteMany({});
        await User.deleteMany({}); // Warning: Clears all users!
        console.log('🧹 Old data cleared.');

        // Insert Movies
        const createdMovies = await Movie.insertMany(movies);
        console.log(`🎬 Inserted ${createdMovies.length} movies.`);

        // Create Showtimes
        const showtimes = [];
        const dates = getDates();
        const times = ["14:00", "17:30", "20:30", "22:00"];

        createdMovies.forEach(movie => {
            // Randomly assign showtimes
            dates.forEach(date => {
                const numShows = Math.floor(Math.random() * 2) + 2; // 2 or 3 shows per day
                for (let i = 0; i < numShows; i++) {
                    showtimes.push({
                        movie: movie._id,
                        date: date,
                        time: times[i],
                        price: movie.featured ? 250 : 150
                    });
                }
            });
        });

        await Showtime.insertMany(showtimes);
        console.log(`🎫 Created ${showtimes.length} showtimes.`);

        // Create Admin User
        // Manually hash to avoid pre-save hook issues during seeding
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync('admin123', salt);

        await User.insertMany([{
            name: 'Gast Admin',
            email: 'admin@gastcinema.com',
            password: hashedPassword,
            role: 'admin'
        }]);

        console.log('👤 Admin user created: admin@gastcinema.com / admin123');

        console.log('✅ Seeding Complete!');
        process.exit();
    })
    .catch(err => {
        console.error('❌ Seeding Failed:', err);
        process.exit(1);
    });
