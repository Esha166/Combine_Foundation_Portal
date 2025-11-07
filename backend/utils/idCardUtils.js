/**
 * Utility functions for ID card generation
 */

// Generate a random 5-6 digit ID number
export const generateRandomIdNumber = () => {
  // Generate a random number between 10000 and 999999 (5-6 digits)
  const min = 10000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Check if an ID number is already in use
export const isIdNumberAvailable = async (IdCard, idNumber) => {
  const existingCard = await IdCard.findOne({ idNumber });
  return !existingCard;
};

// Generate a unique ID number
export const generateUniqueIdNumber = async (IdCard) => {
  let idNumber;
  let isAvailable = false;
  
  while (!isAvailable) {
    idNumber = generateRandomIdNumber();
    isAvailable = await isIdNumberAvailable(IdCard, idNumber);
  }
  
  return idNumber.toString();
};