import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, X, Loader2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface SmartCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
  isLoading?: boolean;
}

export const SmartCameraModal: React.FC<SmartCameraModalProps> = ({ isOpen, onClose, onCapture, isLoading }) => {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImgSrc(imageSrc);
    }
  }, [webcamRef]);

  const retake = () => {
    setImgSrc(null);
  };

  const confirm = async () => {
    if (!imgSrc) return;
    try {
      // Safe base64 to blob conversion
      const base64Data = imgSrc.split(',')[1];
      const byteString = atob(base64Data);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: 'image/jpeg' });
      const file = new File([blob], 'avatar_selfie.jpg', { type: 'image/jpeg' });
      onCapture(file);
    } catch (e) {
      console.error('Error converting image:', e);
      toast.error('Erro ao processar imagem da câmara.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md max-h-[90vh] bg-[#111922] rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-white/10"
          >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-white font-bold text-lg">Verificação Facial</h2>
            <button onClick={onClose} disabled={isLoading} className="text-white/60 hover:text-white p-2">
              <X className="size-5" />
            </button>
          </div>

          {/* Camera Area */}
          <div className="relative w-full flex-1 min-h-[300px] bg-black overflow-hidden flex items-center justify-center">
            {!imgSrc ? (
              <>
                  {navigator.mediaDevices ? (
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{ facingMode: "user" }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                      <p className="text-white text-sm font-bold">Câmara não suportada.</p>
                      <p className="text-white/70 text-xs mt-2">Para usar a câmara, tem de aceder por HTTPS ou estar no localhost.</p>
                    </div>
                  )}
                {/* Oval Overlay (Smart Mask) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                  <defs>
                    <mask id="oval-mask">
                      <rect width="100%" height="100%" fill="white" />
                      <ellipse cx="50%" cy="50%" rx="35%" ry="45%" fill="black" />
                    </mask>
                  </defs>
                  <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0.7)" mask="url(#oval-mask)" />
                  <ellipse cx="50%" cy="50%" rx="35%" ry="45%" fill="none" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="3" strokeDasharray="10 10" className="animate-pulse" />
                </svg>
                <div className="absolute bottom-8 left-0 w-full text-center px-6 pointer-events-none">
                  <p className="text-white font-bold tracking-tight text-sm drop-shadow-md">
                    Posicione o rosto dentro do oval
                  </p>
                  <p className="text-white/70 text-xs mt-1 drop-shadow-md">
                    Certifique-se de que há boa iluminação
                  </p>
                </div>
              </>
            ) : (
              <img src={imgSrc} alt="Captured" className="absolute inset-0 w-full h-full object-cover" />
            )}
          </div>

          {/* Controls */}
          <div className="p-6 bg-[#111922] flex items-center justify-center gap-4">
            {!imgSrc ? (
              <button 
                onClick={capture}
                className="size-16 rounded-full bg-white flex items-center justify-center border-4 border-primary hover:scale-105 active:scale-95 transition-transform"
              >
                <Camera className="size-6 text-black" />
              </button>
            ) : (
              <>
                <button 
                  onClick={retake}
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  Repetir
                </button>
                <button 
                  onClick={confirm}
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-primary text-white hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="size-5 animate-spin" /> : <><Check className="size-5" /> Confirmar</>}
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};
