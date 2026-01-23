require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const Showtime = require('./models/Showtime');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const movies = [
    {
        title: "Chainsaw Man: The Movie - Reze Arc",
        description: "Denji continues his life as a Devil Hunter when he meets Reze, a mysterious girl who works at a café. As their relationship develops, Denji discovers that Reze harbors a dark secret that could change everything. An explosive adaptation of the beloved Reze Arc from the hit manga series.",
        poster: "https://image.tmdb.org/t/p/w500/yVwLRqakGXsMPMvKSAkXuDTEuNm.jpg",
        trailer: "https://www.youtube.com/watch?v=dFlDRhvM4L0",
        featured: true,
        genre: "Animation / Action / Horror",
        duration: 120
    },
    {
        title: "The Fantastic Four: First Steps",
        description: "Set in a retro-futuristic 1960s world, Marvel's First Family—Reed Richards, Sue Storm, Johnny Storm, and Ben Grimm—must harness their newfound powers to save Earth from the cosmic threat of Galactus and his herald, the Silver Surfer.",
        poster: "https://image.tmdb.org/t/p/w500/zDGhneuCEGzjXwjLJfwz0m9WQfD.jpg",
        trailer: "https://www.youtube.com/watch?v=oBKvBAeGYhA",
        featured: true,
        genre: "Action / Sci-Fi / Adventure",
        duration: 150
    },
    {
        title: "Superman",
        description: "The Man of Steel embarks on a journey to reconcile his Kryptonian heritage with his human upbringing as Clark Kent. James Gunn's vision brings a fresh take on the iconic superhero as he faces new threats and discovers what it truly means to be Earth's greatest protector.",
        poster: "https://image.tmdb.org/t/p/w500/dL6xNo8lsqSWhWpfsNMfJDKS3mJ.jpg",
        trailer: "https://www.youtube.com/watch?v=vLLCpLOfZ7Q",
        featured: true,
        genre: "Action / Sci-Fi / Adventure",
        duration: 145
    },
    {
        title: "The Batman",
        description: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement. Robert Pattinson delivers a gripping performance as the Dark Knight in this noir-driven masterpiece.",
        poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fber9oh4mQoqfAO6.jpg",
        trailer: "https://www.youtube.com/watch?v=mqqft2x_Aa4",
        featured: true,
        genre: "Action / Crime / Drama",
        duration: 176
    },
    {
        title: "Demon Slayer: Infinity Castle",
        description: "Tanjiro and the Hashira face their ultimate battle as they storm Muzan Kibutsuji's Infinity Castle. The Demon Slayer Corps must confront the Upper Rank demons in an epic showdown that will determine the fate of humanity. Prepare for breathtaking animation and heart-pounding action.",
        poster: "https://image.tmdb.org/t/p/w500/xGZ8ND5i4dctXC3lJLq7ybJfkBI.jpg",
        trailer: "https://www.youtube.com/watch?v=mU-mEB0glWE",
        featured: true,
        genre: "Animation / Action / Fantasy",
        duration: 135
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
