export interface RawSheetRow {
  c: ({ v: string | number | null; f?: string; } | null)[];
}

export interface RawSheetData {
  table: {
    cols: { id: string; label: string; type: string; }[];
    rows: RawSheetRow[];
  };
}

// Parses the strange JSONP format Google Sheets gviz API returns
const parseGoogleSheetsResponse = (text: string): RawSheetData => {
  const match = text.match(/google\.visualization\.Query\.setResponse\((.*)\)/);
  if (!match || !match[1]) {
    throw new Error('Invalid Google Sheets gviz response format');
  }
  return JSON.parse(match[1]);
};

// Converts the raw sheet data into a more usable array of objects
export const transformRawData = (rawData: RawSheetData): Record<string, any>[] => {
  const headers = rawData.table.cols.map(col => col.label);
  const rows = rawData.table.rows.map(row => {
    const rowObject: Record<string, any> = {};
    row.c.forEach((cell, index) => {
      const header = headers[index];
      if (header) {
        rowObject[header] = cell ? cell.v : null;
      }
    });
    return rowObject;
  });
  return rows;
};


export const fetchGoogleSheetData = async (sheetId: string, sheetName: string): Promise<Record<string, any>[] | null> => {
  if (!sheetId || sheetId === 'YOUR_PUBLIC_GOOGLE_SHEET_ID_HERE') {
    return null; // Don't even attempt to fetch if the ID is a placeholder.
  }
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=${encodeURIComponent(sheetName)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const text = await response.text();
    const parsedData = parseGoogleSheetsResponse(text);
    return transformRawData(parsedData);
  } catch (error) {
    console.error('Failed to fetch or parse Google Sheet data:', error);
    return null; // Return null on any failure to allow for graceful fallback.
  }
};