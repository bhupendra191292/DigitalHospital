// controllers/dashboardController.js
const { Patient, Visit, Appointment } = require('../models');

exports.getDashboardSummary = async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();
    const totalVisits = await Visit.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayVisits = await Visit.countDocuments({
      date: { $gte: today }
    });

    res.json({ totalPatients, totalVisits, todayVisits });
  } catch (err) {
    console.error('[Dashboard Error]', err);
    res.status(500).json({ message: 'Dashboard error', error: err.message });
  }
};

exports.getDashboardActivity = async (req, res) => {
  try {
    const tenant = req.user?.tenant;
    const filter = tenant ? { tenant } : {};

    // Get recent patients
    const recentPatients = await Patient.find(filter)
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name createdAt');

    // Get recent appointments
    const recentAppointments = await Appointment.find(filter)
      .populate('patient', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('patient type status createdAt');

    // Get recent visits
    const recentVisits = await Visit.find(filter)
      .populate('patientId', 'name')
      .sort({ date: -1 })
      .limit(5)
      .select('patientId symptoms diagnosis date');

    // Combine and format activity
    const activity = [];

    // Add patient registrations
    recentPatients.forEach(patient => {
      activity.push({
        id: `patient_${patient._id}`,
        type: 'patient_registered',
        title: 'New Patient Registered',
        description: `${patient.name} was registered to the system`,
        timestamp: patient.createdAt,
        icon: '👤',
        color: 'primary'
      });
    });

    // Add appointments
    recentAppointments.forEach(appointment => {
      activity.push({
        id: `appointment_${appointment._id}`,
        type: 'appointment_scheduled',
        title: 'Appointment Scheduled',
        description: `${appointment.type} appointment for ${appointment.patient?.name || 'Unknown Patient'}`,
        timestamp: appointment.createdAt,
        icon: '📅',
        color: appointment.status === 'Confirmed' ? 'success' : 'warning'
      });
    });

    // Add visits
    recentVisits.forEach(visit => {
      activity.push({
        id: `visit_${visit._id}`,
        type: 'visit_completed',
        title: 'Visit Completed',
        description: `Visit completed for ${visit.patientId?.name || 'Unknown Patient'}`,
        timestamp: visit.date,
        icon: '✅',
        color: 'success'
      });
    });

    // Sort by timestamp and limit to 10 most recent
    activity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    activity.splice(10);

    res.json({
      success: true,
      data: activity
    });
  } catch (err) {
    console.error('[Dashboard Activity Error]', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to load activity data', 
      error: err.message 
    });
  }
};
