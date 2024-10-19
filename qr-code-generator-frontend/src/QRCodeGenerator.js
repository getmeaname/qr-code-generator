import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FacebookShareButton, TwitterShareButton } from 'react-share';

function QRCodeGenerator() {
  const [url, setUrl] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [logo, setLogo] = useState(null);

  const handleLogoUpload = (e) => {
    setLogo(e.target.files[0]);
  };

  const generateQRCode = async () => {
    const formData = new FormData();
    formData.append('url', url);
    if (logo) formData.append('logo', logo);

    try {
      const response = await axios.post('http://localhost:5000/generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setQrCode(response.data.qrCode);
    } catch (error) {
      console.error('Error generating QR code', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
        QR Code Generator
      </h1>

      <input
        type="text"
        className="border p-2 mb-4 w-full max-w-md"
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <input
        type="file"
        className="mb-4"
        onChange={handleLogoUpload}
      />
      
      <button className="bg-blue-500 text-white p-2 mb-4 rounded" onClick={generateQRCode}>
        Generate QR Code
      </button>

      {qrCode && (
        <div className="mt-4 flex flex-col items-center">
          <img src={qrCode} alt="QR Code" className="mb-4" />

          <div className="flex justify-center space-x-4 mt-4">
            <a
              href={qrCode}
              download="qrcode.png"
              className="bg-green-500 text-white p-4 rounded-full hover:bg-green-600 transition duration-300"
              style={{ width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <FontAwesomeIcon icon={faDownload} />
            </a>

            <FacebookShareButton url={url}>
              <div 
                className="bg-blue-600 text-white p-4 rounded-full hover:bg-blue-700 transition duration-300"
                style={{ width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <FontAwesomeIcon icon={faFacebookF} />
              </div>
            </FacebookShareButton>

            <TwitterShareButton url={url}>
              <div 
                className="bg-blue-400 text-white p-4 rounded-full hover:bg-blue-500 transition duration-300"
                style={{ width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <FontAwesomeIcon icon={faTwitter} />
              </div>
            </TwitterShareButton>
          </div>
        </div>
      )}
    </div>
  );
}

export default QRCodeGenerator;