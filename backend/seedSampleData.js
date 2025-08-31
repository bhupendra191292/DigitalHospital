const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const Patient = require('./models/Patient');
const Appointment = require('./models/Appointment');
const Visit = require('./models/Visit');
const Doctor = require('./models/doctorModel');
const Tenant = require('./models/Tenant');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/digital-hospital', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createSampleData = async () => {
  try {
    console.log('🌱 Creating comprehensive sample data...');

    // First, get or create a default tenant
    let tenant = await Tenant.findOne({ slug: 'default-hospital' });
    if (!tenant) {
      tenant = new Tenant({
        name: 'Digital Hospital',
        slug: 'default-hospital',
        type: 'hospital',
        email: 'admin@digitalhospital.com',
        phone: '+1234567890',
        address: {
          street: '123 Healthcare Ave',
          city: 'Medical City',
          state: 'Health State',
          country: 'USA',
          zipCode: '12345'
        },
        subscription: {
          plan: 'professional',
          status: 'active',
          startDate: new Date(),
          maxUsers: 50,
          maxPatients: 1000
        },
        status: 'active',
        features: {
          appointments: true,
          patientManagement: true,
          medicalRecords: true,
          analytics: true,
          reports: true,
          auditLogs: true
        }
      });
      await tenant.save();
      console.log('✅ Default tenant created');
    }

    // Get or create a default doctor
    let doctor = await Doctor.findOne({ phone: '+1234567890' });
    if (!doctor) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      doctor = new Doctor({
        name: 'Dr. Sarah Johnson',
        phone: '+1234567890',
        password: hashedPassword,
        specialization: 'General Medicine',
        role: 'admin',
        tenant: tenant._id,
        isSuperAdmin: false
      });
      await doctor.save();
      console.log('✅ Default doctor created');
    }

    // Sample patient data
    const samplePatients = [
      {
        name: 'John Smith',
        phone: '5551234567',
        age: 45,
        gender: 'Male',
        email: 'john.smith@email.com',
        bloodGroup: 'A+',
        address: '123 Oak Street, Medical City, HS 12345',
        allergies: ['Penicillin', 'Latex'],
        chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
        emergencyContact: {
          name: 'Mary Smith',
          phone: '5551234568'
        },
        medicalNotes: 'Patient has controlled hypertension and diabetes. Regular monitoring required.',
        language: 'English'
      },
      {
        name: 'Emily Davis',
        phone: '5552345678',
        age: 32,
        gender: 'Female',
        email: 'emily.davis@email.com',
        bloodGroup: 'O-',
        address: '456 Pine Avenue, Medical City, HS 12345',
        allergies: ['Sulfa drugs'],
        chronicConditions: ['Asthma'],
        emergencyContact: {
          name: 'Robert Davis',
          phone: '5552345679'
        },
        medicalNotes: 'Asthma well controlled with inhaler. No recent exacerbations.',
        language: 'English'
      },
      {
        name: 'Michael Chen',
        phone: '5553456789',
        age: 28,
        gender: 'Male',
        email: 'michael.chen@email.com',
        bloodGroup: 'B+',
        address: '789 Elm Road, Medical City, HS 12345',
        allergies: [],
        chronicConditions: [],
        emergencyContact: {
          name: 'Lisa Chen',
          phone: '5553456790'
        },
        medicalNotes: 'Generally healthy patient. No chronic conditions.',
        language: 'English'
      },
      {
        name: 'Sarah Wilson',
        phone: '5554567890',
        age: 55,
        gender: 'Female',
        email: 'sarah.wilson@email.com',
        bloodGroup: 'AB+',
        address: '321 Maple Drive, Medical City, HS 12345',
        allergies: ['Ibuprofen'],
        chronicConditions: ['Osteoarthritis', 'High Cholesterol'],
        emergencyContact: {
          name: 'David Wilson',
          phone: '5554567891'
        },
        medicalNotes: 'Managing osteoarthritis with physical therapy. Cholesterol controlled with medication.',
        language: 'English'
      },
      {
        name: 'David Brown',
        phone: '5555678901',
        age: 38,
        gender: 'Male',
        email: 'david.brown@email.com',
        bloodGroup: 'O+',
        address: '654 Cedar Lane, Medical City, HS 12345',
        allergies: ['Shellfish'],
        chronicConditions: ['Migraine'],
        emergencyContact: {
          name: 'Jennifer Brown',
          phone: '5555678902'
        },
        medicalNotes: 'Chronic migraines. Responds well to preventive medication.',
        language: 'English'
      },
      {
        name: 'Lisa Garcia',
        phone: '5556789012',
        age: 41,
        gender: 'Female',
        email: 'lisa.garcia@email.com',
        bloodGroup: 'A-',
        address: '987 Birch Street, Medical City, HS 12345',
        allergies: ['Dairy'],
        chronicConditions: ['Irritable Bowel Syndrome'],
        emergencyContact: {
          name: 'Carlos Garcia',
          phone: '5556789013'
        },
        medicalNotes: 'IBS managed with diet modifications. Dairy-free diet.',
        language: 'English'
      },
      {
        name: 'Robert Taylor',
        phone: '5557890123',
        age: 62,
        gender: 'Male',
        email: 'robert.taylor@email.com',
        bloodGroup: 'B-',
        address: '147 Spruce Avenue, Medical City, HS 12345',
        allergies: ['Aspirin'],
        chronicConditions: ['Heart Disease', 'Diabetes'],
        emergencyContact: {
          name: 'Patricia Taylor',
          phone: '5557890124'
        },
        medicalNotes: 'Post-heart attack patient. Strict medication compliance required.',
        language: 'English'
      },
      {
        name: 'Amanda Martinez',
        phone: '5558901234',
        age: 29,
        gender: 'Female',
        email: 'amanda.martinez@email.com',
        bloodGroup: 'O+',
        address: '258 Willow Road, Medical City, HS 12345',
        allergies: [],
        chronicConditions: ['Anxiety'],
        emergencyContact: {
          name: 'Miguel Martinez',
          phone: '5558901235'
        },
        medicalNotes: 'Anxiety managed with therapy and medication. Good progress.',
        language: 'English'
      }
    ];

    // Create patients
    const createdPatients = [];
    for (const patientData of samplePatients) {
      const existingPatient = await Patient.findOne({ 
        phone: patientData.phone,
        tenant: tenant._id 
      });
      
      if (!existingPatient) {
        const patient = new Patient({
          ...patientData,
          tenant: tenant._id,
          patientId: `PAT${Date.now()}${Math.floor(Math.random() * 1000)}`
        });
        await patient.save();
        createdPatients.push(patient);
        console.log(`✅ Patient created: ${patient.name}`);
      } else {
        createdPatients.push(existingPatient);
        console.log(`ℹ️ Patient already exists: ${existingPatient.name}`);
      }
    }

    // Sample appointments
    const appointmentTypes = ['Checkup', 'Consultation', 'Follow-up', 'Emergency', 'Surgery', 'Test'];
    const appointmentStatuses = ['Scheduled', 'Confirmed', 'Completed', 'Cancelled'];
    
    const sampleAppointments = [];
    for (let i = 0; i < 15; i++) {
      const patient = createdPatients[Math.floor(Math.random() * createdPatients.length)];
      const date = new Date();
      date.setDate(date.getDate() + Math.floor(Math.random() * 30)); // Next 30 days
      date.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 4) * 15, 0, 0);
      
      const appointment = new Appointment({
        patient: patient._id,
        doctor: doctor._id,
        date: date,
        time: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
        type: appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)],
        status: appointmentStatuses[Math.floor(Math.random() * appointmentStatuses.length)],
        notes: `Appointment for ${patient.name} - ${appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)]}`,
        duration: 30,
        priority: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        tenant: tenant._id,
        appointmentId: `APT${Date.now()}${Math.floor(Math.random() * 1000)}`
      });
      
      sampleAppointments.push(appointment);
    }

    // Save appointments
    for (const appointment of sampleAppointments) {
      await appointment.save();
      console.log(`✅ Appointment created: ${appointment.type} for ${appointment.date.toDateString()}`);
    }

    // Sample visits (medical records)
    const sampleVisits = [];
    const diagnoses = [
      'Hypertension', 'Diabetes', 'Asthma', 'Migraine', 'Osteoarthritis', 
      'Heart Disease', 'Anxiety', 'Depression', 'Common Cold', 'Flu',
      'Back Pain', 'Headache', 'Fever', 'Chest Pain', 'Dizziness'
    ];
    
    const treatments = [
      'Medication prescribed', 'Lifestyle modifications', 'Physical therapy',
      'Referral to specialist', 'Follow-up in 2 weeks', 'Blood work ordered',
      'X-ray recommended', 'Surgery scheduled', 'Dietary changes',
      'Exercise program', 'Counseling recommended'
    ];

    for (let i = 0; i < 20; i++) {
      const patient = createdPatients[Math.floor(Math.random() * createdPatients.length)];
      const visitDate = new Date();
      visitDate.setDate(visitDate.getDate() - Math.floor(Math.random() * 90)); // Past 90 days
      
      const diagnosis = diagnoses[Math.floor(Math.random() * diagnoses.length)];
      const treatment = treatments[Math.floor(Math.random() * treatments.length)];
      
      const visit = new Visit({
        patientId: patient._id,
        doctorId: doctor._id,
        date: visitDate,
        symptoms: `Patient reported ${diagnosis.toLowerCase()} symptoms`,
        diagnosis: diagnosis,
        prescription: [
          {
            medicine: 'Sample Medicine',
            dose: '500mg',
            frequency: 'Twice daily'
          }
        ],
        notes: `${treatment}. Patient responded well to treatment.`,
        report: `Visit completed successfully. ${diagnosis} diagnosed and treated.`
      });
      
      sampleVisits.push(visit);
    }

    // Save visits
    for (const visit of sampleVisits) {
      await visit.save();
      console.log(`✅ Visit created: ${visit.diagnosis} for ${visit.date.toDateString()}`);
    }

    console.log('\n🎉 Sample data created successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Patients: ${createdPatients.length}`);
    console.log(`- Appointments: ${sampleAppointments.length}`);
    console.log(`- Medical Visits: ${sampleVisits.length}`);
    console.log(`- Doctor: ${doctor.name}`);
    console.log(`- Tenant: ${tenant.name}`);
    
    console.log('\n🔑 Test Credentials:');
    console.log('Phone: +1234567890');
    console.log('Password: admin123');
    
    console.log('\n📱 Sample Patient Phone Numbers:');
    createdPatients.forEach(patient => {
      console.log(`- ${patient.name}: ${patient.phone}`);
    });

  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  } finally {
    mongoose.disconnect();
  }
};

createSampleData();
