import miel1 from '../assets/miel1.jpg';
import miel2 from '../assets/miel2.jpg';
import miel3 from '../assets/miel3.jpg';
import miel4 from '../assets/miel4.jpg';

import oil1 from '../assets/oil1.jpg';
import oil2 from '../assets/oil2.jpg';
import oil3 from '../assets/oil3.jpg';
import oil4 from '../assets/oil4.jpg';

import amlou1 from '../assets/amlou1.jpg';
import amlou2 from '../assets/amlou2.jpg';
import amlou3 from '../assets/amlou3.jpg';
import amlou4 from '../assets/amlou4.jpg';

export const staticProducts = [
  // Honey Products
  {
    id: 1,
    name: { fr: "Miel d'Euphorbe (Dghmous)", ar: "عسل الدغموس" },
    slug: "miel-dghmous",
    categorySlug: "miel-naturel",
    price: 350,
    originalPrice: 400,
    images: [miel1, miel2, miel3, miel4],
  },
  {
    id: 2,
    name: { fr: "Miel de Thym", ar: "عسل الزعتر" },
    slug: "miel-de-thym",
    categorySlug: "miel-naturel",
    price: 250,
    images: [miel2, miel1, miel3, miel4],
  },
  {
    id: 7,
    name: { fr: "Miel d'Oranger", ar: "عسل البرتقال" },
    slug: "miel-oranger",
    categorySlug: "miel-naturel",
    price: 180,
    images: [miel3, miel1, miel2, miel4],
  },
  {
    id: 8,
    name: { fr: "Miel de Eucalyptus", ar: "عسل الكالبتوس" },
    slug: "miel-eucalyptus",
    categorySlug: "miel-naturel",
    price: 220,
    images: [miel4, miel1, miel2, miel3],
  },

  // Oils
  {
    id: 3,
    name: { fr: "Huile d'Argan Alimentaire", ar: "زيت أركان للأكل" },
    slug: "argan-alimentaire",
    categorySlug: "huiles-naturelles",
    price: 450,
    originalPrice: 500,
    images: [oil1, oil2, oil3, oil4],
  },
  {
    id: 4,
    name: { fr: "Huile de Figue de Barbarie", ar: "زيت تين شوكي" },
    slug: "huile-figue-barbarie",
    categorySlug: "huiles-naturelles",
    price: 800,
    images: [oil2, oil1, oil3, oil4],
  },
  {
    id: 9,
    name: { fr: "Huile d'Amande Douce", ar: "زيت اللوز الحلو" },
    slug: "huile-amande-douce",
    categorySlug: "huiles-naturelles",
    price: 120,
    images: [oil3, oil1, oil2, oil4],
  },
  {
    id: 10,
    name: { fr: "Huile de Ricin", ar: "زيت الخروع" },
    slug: "huile-ricin",
    categorySlug: "huiles-naturelles",
    price: 80,
    images: [oil4, oil1, oil2, oil3],
  },

  // Amlou
  {
    id: 5,
    name: { fr: "Amlou Amandes & Argan", ar: "أملو باللوز وأركان" },
    slug: "amlou-amande",
    categorySlug: "amlou",
    price: 180,
    images: [amlou1, amlou2, amlou3, amlou4],
  },
  {
    id: 6,
    name: { fr: "Amlou Cacahuètes", ar: "أملو كاوكاو" },
    slug: "amlou-cacahuete",
    categorySlug: "amlou",
    price: 90,
    images: [amlou4, amlou3, amlou2, amlou1],
  },
  {
    id: 11,
    name: { fr: "Amlou Noisettes", ar: "أملو بالبندق" },
    slug: "amlou-noisette",
    categorySlug: "amlou",
    price: 250,
    images: [amlou2, amlou1, amlou3, amlou4],
  },
  {
    id: 12,
    name: { fr: "Amlou Miel & Argan", ar: "أملو بالعسل وأركان" },
    slug: "amlou-miel",
    categorySlug: "amlou",
    price: 210,
    images: [amlou3, amlou1, amlou2, amlou4],
  },
];
