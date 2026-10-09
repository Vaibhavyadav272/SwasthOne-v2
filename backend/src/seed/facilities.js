require("dotenv").config();

const connectDB = require("../config/db");
const Facility = require("../models/Facility");

const facilities = [
  {
    facilityId: "phc-1",
    name: "Test Primary Health Centre",
    type: "phc",
    village: "Test Village",
    district: "Sagar",
    state: "Madhya Pradesh",
    phone: "9876543211",
    address: "Test Village, Sagar",
    isActive: true,
  },
  {
    facilityId: "chc-1",
    name: "Community Health Centre Sagar",
    type: "chc",
    district: "Sagar",
    state: "Madhya Pradesh",
    phone: "9876543212",
    address: "Sagar, Madhya Pradesh",
    isActive: true,
  },
  {
    facilityId: "dh-1",
    name: "District Hospital Sagar",
    type: "district_hospital",
    district: "Sagar",
    state: "Madhya Pradesh",
    phone: "9876543213",
    address: "Sagar, Madhya Pradesh",
    isActive: true,
  },
];

const seedFacilities = async () => {
  try {
    await connectDB();

    await Facility.deleteMany({});
    await Facility.insertMany(facilities);

    console.log("Facilities seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Facility seed error:", error.message);
    process.exit(1);
  }
};

seedFacilities();
