const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Static file serving
app.use("/downloads", express.static(path.join(__dirname, "../downloads")));
app.use(express.static(path.join(__dirname, "../frontend")));

// eBooks data
const ebooks = [
  {
    id: 1,
    title: "Programming in Python 3: A Complete Introduction to the Python Language",
    author: "Mark Summerfield",
    description: "Python 3 is the best version of the language yet: It is more powerful, convenient, consistent, and expressive than ever before. Now, leading Python programmer Mark Summerfield demonstrates how to write code that takes full advantage of Python 3's features and idioms. Programming in Python 3, Second Edition, brings together all the knowledge you need to write any program, use any standard or third-party Python 3 library, and create new library modules of your own.",
    coverImage: "/downloads/python.jpeg",
    downloadLink: "/downloads/python.pdf",
  },
  {
    id: 2,
    title: "Mindset - Changing The Way You think To Fulfil Your Potential",
    author: "Carol Dweck",
    description: "World-renowned Stanford University psychologist Carol Dweck, in decades of research on achievement and success, has discovered a truly groundbreaking idea-the power of our mindset. Dweck explains why it's not just our abilities and talent that bring us success-but whether we approach them with a fixed or growth mindset. She makes clear why praising intelligence and ability doesn't foster self-esteem and lead to accomplishment, but may actually jeopardize success. With the right mindset, we can motivate our kids and help them to raise their grades, as well as reach our own goals-personal and professional. Dweck reveals what all great parents, teachers, CEOs, and athletes already know: how a simple idea about the brain can create a love <br> of learning and a resilience that is the basis of great accomplishment in every area.",
    coverImage: "/downloads/mindset.jpeg",
    downloadLink:"/downloads/Mindset -  Changing The Way You think To Fulfil Your Potential.pdf",
  },
  {
    id: 3,
    title: "Why Nations Fail:The Origins of Power, Prosperity and Poverty",
    author: "BY THE NOBEL PRIZE-WINNING ECONOMISTS DARON ACEMOGLU & JAMES A. ROBINSON",
    description: "A foundational guide to machine learning concepts.",
    coverImage: "/downloads/why.jpeg",
    downloadLink: "/downloads/Why-Nations-Fail-Daron-Acemoglu.pdf",
  },

  {
    id: 4, 
    title: "Easy Journey To Other Planets",
    author: "His Divine Grace A. C. Bhaktivedanta Swami Prabhupada",
    description: "A spiritual perspective on interplanetary travel.",
    coverImage: "/downloads/journey.jpeg",
    downloadLink: "/downloads/journey.pdf",
  },

  {
    id: 5, 
    title: "1984",
    author: "George Orwell",
    description: "George Orwell (1903–1950), the pen name of Eric Arthur Blair, was an English novelist, essayist, and critic. He was born in India and educated at Eton. After service with the Indian Imperial Police in Burma, he returned to Europe to earn his living by writing. An author and journalist, Orwell was one of the most prominent and influential figures in twentieth-century literature. His unique political allegory Animal Farm was published in 1945, and it was this novel, together with the dystopia of 1984 (1949), which brought him worldwide fame.",
    coverImage: "/downloads/1984.jpg",
    downloadLink: "/downloads/1984.pdf",
  },

  
  {
    id: 5, 
    title: "Gangs Of America",
    author: "Ted Nace",
    description: "While working for the u.s. forest service during high school, Ted Nace learned about the plans of several major corporations to develop coal strip mines and other energy projects near his hometown of Dickinson, North Dakota. During graduate school, Nace worked for the Environmental Defense Fund, where he helped develop computerized simulations that demonstrated the investor and ratepayer benefits of re- placing coal-fired power plants with alternative energy programs. The EDF simulations led to the cancellation of a multi-billion-dollar coal- based power complex proposed by two California utilities. After completing his graduate studies, Nace worked for the Dakota Resource Council, a citizens’ group concerned about the impacts of energy development on agriculture and rural communities.",
    coverImage: "/downloads/gangsofamerica.jpeg",
    downloadLink: "/downloads/gangsofamerica.pdf",
  },
  {
    id: 5, 
    title: "The Real Book of Real Estate: Real Experts. Real Stories. Real Life.",
    author: "Robert T. Kiyosaki ",
    description: "In a world where too many financial advisors do not follow their own advice, here is a book written by experts who practice what they teach and who will teach you to thrive, not merely survive, during turbulent economic times. This is the real deal... The Real Book of Real Estate. The only thing better than one real estate expert teaching you how to invest and win is 20 real estate experts with that same mission. For the first time ever, Robert Kiyosaki, best-selling author of Rich Dad Poor Dad, has assembled in one book an unrivaled cast of real estate wizards and trusted advisors with one purpose in mind: to share their knowledge and teach you to win in real estate.This is the ultimate real estate book you will come back to again and again. Read it cover to cover, or use it as a guide to help when you need it most. The Real Book of Real Estate will be your #1 source as you determine the real estate niche that is perfect for you and as you navigate the ups and downs of the real estate market and become the expert you know you can be.",
    coverImage: "/downloads/81QnPa5Tp4L._AC_UY218_.jpg",
    downloadLink: "/downloads/81QnPa5Tp4L._AC_UY218_.jpg",
  },
];

// Routes
app.get("/ebook", (req, res) => {
  res.status(200).json(ebooks);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html")); // Corrected path
});

// Handle invalid routes
app.use((req, res) => {
  res.status(404).json({ error: "Resource not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${5000}`);
});
