import { extname } from 'path';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { storage } from './firebase.config';

export const uploadPhotoFirebase = async (file: Express.Multer.File) => {
  const randomName = Array(32)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  const ext = extname(file.originalname);
  const fileName = `${randomName}${ext}`;
  const imageRef = ref(storage, `imagenes/${fileName}`);

  await uploadBytes(imageRef, file.buffer).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  });

  const httpsReference = ref(
    storage,
    `https://firebasestorage.googleapis.com/v0/b/bucket/o/${fileName}?alt=media`,
  );
  const imageUrl = await getDownloadURL(imageRef);
  return imageUrl;
};

export const deleteImageReference = (imageUrl: string) => {
  const deleteImageRef = ref(
    storage,
    `imagenes/${imageUrl.split('/imagenes%2F').pop().split('?')[0]}`,
  );
  deleteObject(deleteImageRef)
    .then(() => {
      console.log('File delete');
    })
    .catch((error) => {
      console.log(error);
    });
};
