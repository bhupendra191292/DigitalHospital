const Patient = require('../models/Patient');
const { generateTenantId } = require('../middlewares/tenantMiddleware');

const registerPatient = async (req, res) => {
    const {
      phone,
      name,
      age,
      dob = null,
      gender = null,
      address = null,
      email = null,
      bloodGroup = null,
      allergies = [],
      chronicConditions = [],
      emergencyContact = {},
      medicalNotes = null,
      language = null
    } = req.body;
  
    try {
      // Enhanced validation
      if (!name || !phone || !age || !address) {
        return res.status(400).json({ 
          message: 'Missing required fields: name, phone, age, and address are required' 
        });
      }

      // Phone number validation
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length < 10 || cleanPhone.length > 15) {
        return res.status(400).json({ 
          message: 'Invalid phone number. Must be 10-15 digits.' 
        });
      }

      // Age validation
      if (age < 0 || age > 150) {
        return res.status(400).json({ 
          message: 'Invalid age. Must be between 0 and 150.' 
        });
      }

      // Email validation (if provided)
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ 
          message: 'Invalid email address format.' 
        });
      }

      // Check for existing patient with same phone in same tenant
      const existing = await Patient.findOne({ 
        phone: cleanPhone, 
        tenant: req.user?.tenant || '507f1f77bcf86cd799439011'
      });
      
      if (existing) {
        return res.status(409).json({ 
          message: 'A patient with this phone number already exists in this clinic.' 
        });
      }

      // Create patient with enhanced data
      const patient = await Patient.create({
        phone: cleanPhone,
        name: name.trim(),
        age: parseInt(age),
        dob: dob || null,
        gender,
        address: address.trim(),
        email: email ? email.trim() : null,
        bloodGroup,
        allergies: Array.isArray(allergies) ? allergies : [],
        chronicConditions: Array.isArray(chronicConditions) ? chronicConditions : [],
        emergencyContact: {
          name: emergencyContact.name ? emergencyContact.name.trim() : null,
          phone: emergencyContact.phone ? emergencyContact.phone.replace(/\D/g, '') : null
        },
        medicalNotes: medicalNotes ? medicalNotes.trim() : null,
        language: language || 'English',
        tenant: req.user?.tenant || '507f1f77bcf86cd799439011',
        patientId: generateTenantId('PAT', req.user?.tenant || '507f1f77bcf86cd799439011')
      });
  
      res.status(201).json({
        ...patient.toObject(),
        message: 'Patient registered successfully'
      });
    } catch (err) {
      console.error('Patient registration error:', err);
      res.status(500).json({ 
        message: 'Failed to register patient',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
      });
    }
  };
  

const checkPatient = async (req, res) => {
  const { phone } = req.body;
  try {
    const patient = await Patient.findOne({ phone }).populate('visits');
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Failed to check patient', error: err.message });
  }
};

const getPatientById = async (req, res) => {
    try {
      const patient = await Patient.findById(req.params.id).populate('visits');
      if (!patient) return res.status(404).json({ message: 'Patient not found' });
  
      res.json(patient);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching patient', error: err.message });
    }
  };

  const getPatientsByPhone = async (req, res) => {
    try {
      const phone = req.params.phone;
      const patients = await Patient.find({ "contact.phone": phone });
      res.status(200).json(patients);
    } catch (error) {
      res.status(500).json({ message: "Error fetching patients by phone", error });
    }
  };
  

const getPatients = async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '', gender } = req.query;
      const query = {};
  
      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { phone: new RegExp(search, 'i') }
        ];
      }
  
      if (gender) {
        query.gender = gender;
      }
  
      const total = await Patient.countDocuments(query);
      const patients = await Patient.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate({
          path: 'visits',
          options: { sort: { date: -1 }, limit: 1 }, // last visit
        });
  
      const data = patients.map((p) => ({
        _id: p._id,
        name: p.name,
        phone: p.phone,
        age: p.age,
        gender: p.gender,
        lastVisit: p.visits?.[0]?.date || null,
      }));
  
      res.json({
        data,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
      });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching patients', error: err.message });
    }
  };

  
module.exports = {
  registerPatient,
  checkPatient,
  getPatientById,
  getPatients,
  getPatientsByPhone
};
