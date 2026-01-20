import { addSearchHistory } from './database';

export const seedMockData = async (): Promise<void> => {
  try {
    await addSearchHistory('Delhi', 'Agra');
    await new Promise(resolve => setTimeout(resolve, 100));
    
    await addSearchHistory('Delhi', 'Jaipur');
    await new Promise(resolve => setTimeout(resolve, 100));
    
    await addSearchHistory('Mumbai', 'Pune');
    await new Promise(resolve => setTimeout(resolve, 100));
    
    await addSearchHistory('Bangalore', 'Chennai');
    await new Promise(resolve => setTimeout(resolve, 100));
    
    await addSearchHistory('Hyderabad', 'Vijayawada');
    
    console.log('Mock data seeded successfully');
  } catch (error) {
    console.error('Error seeding mock data:', error);
  }
};
