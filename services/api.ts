import { DashboardData } from '../types';
import { processDashboardData } from './dataProcessor';

// This function generates raw data similar to what we'd get from Google Sheets
const generateRawMockData = (): Record<string, any>[] => {
  const interviewers = ['INT001', 'INT002', 'INT003', 'INT004', 'INT005', 'INT006', 'INT007', 'INT008', 'INT009', 'INT010', 'INT011', 'INT012'];
  const lgas = ['Abeokuta North', 'Abeokuta South', 'Ado-Odo/Ota', 'Ewekoro', 'Ifo', 'Ijebu East', 'Ijebu North', 'Ijebu Ode', 'Ikenne', 'Imeko Afon'];
  const states = ['Ogun'];
  const statuses = ['Approved', 'Not Approved', 'Pending'];
  const errorFlags = ['Clustered Interview', 'Duplicate Phone', 'High LOI', 'Interwoven', 'Low LOI', 'Odd Hour', 'Outside LGA Boundary', 'Short Gap', 'Terminated'];
  const paths = ['Treatment', 'Control'];
  const ageGroups = ['18-25', '26-35', '36-45', '46+'];
  const genders = ['Male', 'Female'];

  const submissions = [];
  for (let i = 0; i < 850; i++) {
    const status = statuses[Math.floor(Math.random() * 100) % 3]; // Skew towards approved/pending
    const hasErrors = status === 'Not Approved' && Math.random() > 0.1;
    const numErrors = hasErrors ? Math.floor(Math.random() * 2) + 1 : 0;

    submissions.push({
      'ID': `SUB_${i + 1}`,
      'Timestamp': new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toLocaleString('en-US', { timeZone: 'UTC' }),
      'LGA': lgas[i % lgas.length],
      'State': states[i % states.length],
      'Interviewer ID': interviewers[i % interviewers.length],
      'Status': status,
      'Error Flags': hasErrors ? Array.from(new Set(Array.from({ length: numErrors }, () => errorFlags[Math.floor(Math.random() * errorFlags.length)]))).join(', ') : '',
      'Path': paths[i % paths.length],
      'Age Group': ageGroups[i % ageGroups.length],
      'Gender': genders[i % genders.length],
      'GPS': `${6.7756 + (Math.random() - 0.5) * 2}, ${3.3432 + (Math.random() - 0.5) * 2}`,
    });
  }
  return submissions;
};


// This function serves as the single source for mock data, processed and ready for the UI
export const getMockDashboardData = (): DashboardData => {
  const rawData = generateRawMockData();
  // We re-use the same processor as the live data to ensure data shape consistency
  const processedData = processDashboardData(rawData);
  
  processedData.statusMessage = `Latest submissions from ${processedData.metadata.lgas.length} LGAs available.`;

  return processedData;
};