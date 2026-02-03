import { useState } from 'react';
import Modal from '../common/Modal';

const CardPreview = ({ imageUrl, thumbnailUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!imageUrl && !thumbnailUrl) {
    return (
      <div className="aspect-[1.75/1] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <svg
            className="w-12 h-12 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm">No card image</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full aspect-[1.75/1] bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <img
          src={thumbnailUrl || imageUrl}
          alt="Business card"
          className="w-full h-full object-cover"
        />
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Business Card"
        size="lg"
      >
        <div className="flex justify-center">
          <img
            src={imageUrl}
            alt="Business card full size"
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
          />
        </div>
      </Modal>
    </>
  );
};

export default CardPreview;
