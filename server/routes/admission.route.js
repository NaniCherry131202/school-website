import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import Admission from '../models/Admission.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to verify admin role
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

router.post(
  '/',
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'aadhar', maxCount: 1 },
    { name: 'birthCertificate', maxCount: 1 }, // New field
    { name: 'signature', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        student,
        address,
        father,
        mother,
        admissionDetails,
        previousAcademicRecord,
        appraisal,
        parentGuardian,
      } = req.body;

      const parsedStudent = typeof student === 'string' ? JSON.parse(student) : student;
      const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
      const parsedFather = typeof father === 'string' ? JSON.parse(father) : father;
      const parsedMother = typeof mother === 'string' ? JSON.parse(mother) : mother;
      const parsedAdmissionDetails =
        typeof admissionDetails === 'string' ? JSON.parse(admissionDetails) : admissionDetails;
      const parsedPreviousAcademicRecord =
        typeof previousAcademicRecord === 'string'
          ? JSON.parse(previousAcademicRecord)
          : previousAcademicRecord;
      const parsedAppraisal = typeof appraisal === 'string' ? JSON.parse(appraisal) : appraisal;
      const parsedParentGuardian =
        typeof parentGuardian === 'string' ? JSON.parse(parentGuardian) : parentGuardian;

      if (
        !parsedStudent.name ||
        !parsedStudent.dob ||
        !parsedStudent.aadharNo ||
        !parsedStudent.gender ||
        !parsedAddress.residentialAddress ||
        !parsedFather.name ||
        !parsedFather.mobile ||
        !parsedMother.name ||
        !parsedMother.mobile ||
        !parsedAdmissionDetails.class ||
        !parsedAdmissionDetails.academicYear ||
        !parsedParentGuardian.name ||
        !req.files.photo ||
        !req.files.aadhar ||
        !req.files.birthCertificate // Require birthCertificate
      ) {
        return res.status(400).json({ message: 'All required fields and files must be provided.' });
      }

      const uploadFile = (file, folder) =>
        new Promise((resolve, reject) => {
          const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'image';
          const stream = cloudinary.uploader.upload_stream(
            { folder: `admissions/${folder}`, resource_type: resourceType, access_mode: 'authenticated' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            },
          );
          stream.end(file.buffer);
        });

      const photoUrl = await uploadFile(req.files.photo[0], 'photos');
      const aadharUrl = await uploadFile(req.files.aadhar[0], 'aadhar');
      const birthCertificateUrl = await uploadFile(req.files.birthCertificate[0], 'birthCertificates'); // Upload new file
      const signatureUrl = req.files.signature
        ? await uploadFile(req.files.signature[0], 'signatures')
        : null;

      const newAdmission = new Admission({
        student: parsedStudent,
        address: parsedAddress,
        father: parsedFather,
        mother: parsedMother,
        admissionDetails: parsedAdmissionDetails,
        previousAcademicRecord: parsedPreviousAcademicRecord,
        appraisal: parsedAppraisal,
        parentGuardian: {
          name: parsedParentGuardian.name,
          signature: signatureUrl,
        },
        photo: photoUrl,
        aadhar: aadharUrl,
        birthCertificate: birthCertificateUrl, // Store new file URL
      });

      const savedAdmission = await newAdmission.save();
      res.status(201).json({
        message: 'Application submitted successfully!',
        formNo: savedAdmission.formNo,
      });
    } catch (error) {
      console.error('Error saving admission:', error);
      res.status(500).json({ message: 'An error occurred while processing your application.' });
    }
  },
);

router.get('/', verifyAdmin, async (req, res) => {
  try {
    const admissions = await Admission.find();
    const signedAdmissions = admissions.map(admission => {
      // Generate signed URL for Aadhaar PDF
      const signedAadharUrl = cloudinary.utils.private_download_url(admission.aadhar, 'pdf', {
        resource_type: 'raw',
        attachment: false,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
      });
      // Generate signed URL for Birth Certificate image
      const signedBirthCertificateUrl = cloudinary.utils.private_download_url(admission.birthCertificate, 'jpg', {
        resource_type: 'image',
        attachment: false,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
      });
      return {
        ...admission._doc,
        aadhar: signedAadharUrl,
        birthCertificate: signedBirthCertificateUrl, // Include signed URL
      };
    });
    res.status(200).json(signedAdmissions);
  } catch (error) {
    console.error('Error fetching admissions:', error);
    res.status(500).json({ message: 'An error occurred while fetching admissions.' });
  }
});

export default router;