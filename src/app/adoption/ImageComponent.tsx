import React, { useEffect, useState } from 'react';
import { Picture, getPictures } from './GetImages';

interface PictureProps {
  imageId: number;
}

const ImageComponent: React.FC<PictureProps> = ({imageId}) => {
  const [picture, setPicture] = useState<Picture | null>(null);

  useEffect(() => {
    getPictures(imageId)
      .then((data) => setPicture(data))
      .catch((error) => console.error('Error loading image:', error));
  }, [imageId]);

  if(!picture) {
    return <p>Loading image...</p>;
  }

  return (
    <img 
      src={picture.name}
      className='rounded-md shadow-md'
    />
  );
};

export default ImageComponent;