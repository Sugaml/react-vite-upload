import React, { useState,useEffect } from 'react';
import { Table, TableBody, TableContainer, TableHead, TableRow, TableCell, Paper, Button } from '@mui/material';
import FileRow from './FileRow';
import { uploadFile } from '../services/apiService';
import { callSecondAPI } from '../services/api';

const DocumentUpload = () => {
  // State variables for file data
  const [photo, setPhoto] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [certificateURL, setCertificateURL] = useState(null);

  // State variables to track completion of required fields
  const [isPhotoCompleted, setIsPhotoCompleted] = useState(false);
  const [isCertificateCompleted, setIsCertificateCompleted] = useState(false);

  // Function to handle file upload
  const handleUpload = (file, fileType) => {

      // Update the state with the file data and set completion status
      switch (fileType) {
        case 'photo':
          setPhoto(file);
          setIsPhotoCompleted(true);
          break;
        case 'certificate':
          setCertificate(file);
          setIsCertificateCompleted(true);
          break;
        // Handle other file types here
        default:
          break;
      }
  
  };

  // Function to handle the overall submission
  const handleSubmit = async () => {
    console.log("Clicked Submit button");
    try {
      // Upload each file to the server and get the file URLs
      if (photo) {
        const url = await uploadFile(photo, 'photo');
        console.log("Return Photo URL :: ",url)
        setPhotoURL(url);
      }

      if (certificate) {
        const url = await uploadFile(certificate, 'certificate');
        console.log("Return Cert URL :: ",url)
        setCertificateURL(url);
      }
      console.log("File URL :: ",photoURL,certificateURL)
    } catch (error) {
      console.error('Form submission failed:', error);
    }
    resetForm();
  };

  // Function to reset the form after submission
  const resetForm = () => {
    setPhoto(null);
    setCertificate(null);
    setIsPhotoCompleted(false);
    setIsCertificateCompleted(false);
  };

  // Check if all required fields are completed
  const isFormCompleted = isPhotoCompleted && isCertificateCompleted;
  // Add additional checks for other required fields
  useEffect(() => {
    if (photoURL && certificateURL) {
      // Call the second API with the file URLs
      const data = {
        see_transcript: photoURL,
        see_character: certificateURL,
        certificate_transcript: "",
        certificate_character: "",
        certificate_migration: "",
        citizenship_front: "",
        citizenship_back: "",
        student_id: 1,
      };
      callSecondAPI(data)
        .then((response) => {
          // Handle the response from the second API if needed
          console.log("Response from second API:", response);
          // Clear the form or show a success message
          // You can also handle other logic here
        })
        .catch((error) => {
          // Handle errors if the second API call fails
          console.error("Error calling second API:", error);
        });
    }
  }, [photoURL, certificateURL]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Required/Optional</TableCell>
            <TableCell>Supported Format</TableCell>
            <TableCell>Upload</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <FileRow
            name="Photo"
            required={true}
            supportedFormats=".jpg, .png"
            onUpload={(file) => handleUpload(file, 'photo')}
            uploadSizeRange={{ min: 0, max: 10 }} // Provide the desired size range in MB
            onCompletionChange={setIsPhotoCompleted}
          />
          <FileRow
            name="Certificate"
            required={true}
            supportedFormats=".jpg, .png"
            onUpload={(file) => handleUpload(file, 'certificate')}
            uploadSizeRange={{ min: 0, max: 10 }} // Provide the desired size range in MB
            onCompletionChange={setIsCertificateCompleted}
          />
          {/* Add similar rows for other files (signature, bank voucher, transcript) */}
        </TableBody>
      </Table>

      {/* Submit Button */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!isFormCompleted}>
          Submit
        </Button>
      </div>
    </TableContainer>
  );
};

export default DocumentUpload;
