import React from 'react';
import { google, Auth } from 'googleapis';
import { LotteryMatrix } from './lottery-matrix';
import { LOTTERY_CONFIG, LotteryType } from './lottery-config';
import { LotteryView } from './lottery-view'; // Add this line to import LotteryView
import { formatDate, parseDate, parseLotteryNumbers } from './lottery-utils';

const getSheetData = async () => {
    // Implementation similar to your original getSheetData function
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            client_id: process.env.GOOGLE_SERVICE_ACCOUNT_ID,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        },
        scopes: "https://www.googleapis.com/auth/spreadsheets.readonly",
    });

    const authClient = await auth.getClient() as Auth.OAuth2Client;
    const sheets = google.sheets({ version: "v4", auth: authClient });
    const range = "Sheet1!A:Z";

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range,
        });

        return response.data.values;
    } catch (error) {
        console.error("Error fetching sheets data: ", error);
        return [];
    }
};

export const LotteryResults = async () => {
    const rawData = await getSheetData();
    if (!rawData || !rawData.length) return <div>No data found</div>;
  
    // Process all data with lottery types
    const processedData = rawData
      .slice(1)
      .map(row => {
        const lotteryType = row[1] as LotteryType;
        const numbers = parseLotteryNumbers(row[2], lotteryType);
        const date = parseDate(row[3]);
        
        return numbers && date ? { 
          id: row[0],
          lotteryType,
          numbers,
          date: formatDate(date)
        } : null;
      })
      .filter(Boolean) as Array<{
        id: string;
        lotteryType: LotteryType;
        numbers: number[];
        date: string;
      }>;
  
    if (!processedData.length) return <div>No valid data found</div>;
  
    return <LotteryView allData={processedData} />;
  };