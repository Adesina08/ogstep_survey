import { useQuery } from '@tanstack/react-query';
import { fetchGoogleSheetData } from '../services/googleSheetsService';
import { processDashboardData } from '../services/dataProcessor';
import { DashboardData } from '../types';
import { getMockDashboardData } from '../services/api';

// --- CONFIGURATION ---
// IMPORTANT: Replace this with your actual Google Sheet ID.
// The sheet must be public ("Anyone with the link can view").
const GOOGLE_SHEET_ID = '18iZezzcKT2JTvf7h9R_yU0LHEHNhPEIDVhJlcJs0yPc'; 
const SHEET_NAME = 'Data';
// -------------------

const fetchDataAndProcess = async (): Promise<DashboardData> => {
  // Attempt to fetch live data first
  const rawData = await fetchGoogleSheetData(GOOGLE_SHEET_ID, SHEET_NAME);

  if (rawData) {
    // Live data was fetched successfully
    if (rawData.length === 0) {
        console.warn("Live data fetched but the sheet is empty. Falling back to mock data.");
        return getMockDashboardData();
    }
    console.log("Successfully loaded live data from Google Sheets.");
    return processDashboardData(rawData);
  } else {
    // Live data fetch failed (returned null)
    console.warn(
      "--- LIVE DATA FETCH FAILED ---\n" +
      "Could not fetch live data from Google Sheets. This is expected if you haven't configured a valid, public Sheet ID yet.\n" +
      "Common reasons for failure:\n" +
      "1. The GOOGLE_SHEET_ID is incorrect or a placeholder.\n" +
      "2. The Google Sheet is not public (set Share to 'Anyone with the link can view').\n" +
      "3. The sheet name does not match exactly.\n" +
      "4. Network connectivity issue.\n\n" +
      "The application will now use built-in mock data."
    );
    // Fallback to mock data
    return getMockDashboardData();
  }
};

export const useDashboardData = () => {
  return useQuery<DashboardData, Error>({
    queryKey: ['dashboardData', GOOGLE_SHEET_ID, SHEET_NAME],
    queryFn: fetchDataAndProcess,
    refetchOnWindowFocus: false, 
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
  });
};