import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button, Modal } from "antd";

const QRScanner = () => {
  const qrCodeRef = useRef(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [scannedUrl, setScannedUrl] = useState("");
  useEffect(() => {
    const qrCodeScanner = new Html5QrcodeScanner(
      qrCodeRef.current.id,
      {
        fps: 10, // Frame per second
        qrbox: { width: 250, height: 250 }, // QR code scanning box size
      },
      false // verbose
    );

    qrCodeScanner.render(
      (decodedText, decodedResult) => {
        // Handle the decoded text and result here
        setScannedUrl(decodedText);
        setModalIsOpen(true);
        console.log(`Decoded text: ${decodedText}`, decodedResult);
        // alert(`QR Code scanned: ${decodedText}`);
      },
      (errorMessage) => {
        // Handle errors here
        console.log(`Error scanning: ${errorMessage}`);
      }
    );

    return () => {
      qrCodeScanner.clear(); // Cleanup when component unmounts
    };
  }, []);
  const handleNext = () => {
    setModalIsOpen(false);
    if (scannedUrl) {
      let url = scannedUrl.replace(
        "http://localhost:3000/",
        "https://localhost:3001/"
      );
      console.log(url);
      window.location.href = url;
    }
  };
  const handleClose = () => {
    setModalIsOpen(false);
  };
  return (
    <div>
      <h1>Quest mã QR</h1>
      <div id="qr-reader" ref={qrCodeRef} style={{ width: "100%" }} />
      <Modal
        open={modalIsOpen}
        footer={[
          <Button onClick={handleClose} type="default">
            Đóng
          </Button>,
          <Button onClick={handleNext} type="link">
            Chuyển tiếp
          </Button>,
        ]}
      >
        <p>
          URL:{" "}
          {scannedUrl.replace(
            "http://localhost:3000/",
            "https://localhost:3001/"
          )}
        </p>
      </Modal>
    </div>
  );
};

export default QRScanner;
