import { nango } from "../server";

const ranges = {
  "1": "A",
  "2": "B",
  "3": "C",
  "4": "D",
  "5": "E",
  "6": "F",
  "7": "G",
  "8": "H",
  "9": "I",
  "10": "J",
  "11": "K",
  "12": "L",
  "13": "M",
  "14": "N",
  "15": "O",
  "16": "P",
  "17": "Q",
  "18": "R",
  "19": "S",
  "20": "T",
  "21": "U",
  "22": "V",
  "23": "W",
  "24": "X",
  "25": "Y",
  "26": "Z",
} as const;

type GoogleSheet = {
  spreadsheetId: string;
  properties: {
    title: string;
  };
  spreadsheetUrl: string;
};

const integration = "google-sheets";

export function getRange(rangeNumber: number) {
  return `A1:${ranges[rangeNumber.toString() as keyof typeof ranges]}1`;
}

export async function createGoogleSheet(
  connectionId: string,
  title: string | undefined,
) {
  const result = await nango.post<GoogleSheet>({
    endpoint: "/v4/spreadsheets",
    providerConfigKey: integration,
    connectionId,
    retries: 5,
    data: {
      properties: {
        title,
      },
    },
  });

  return result;
}

export async function getSpreadSheet(
  spreadsheetId: string,
  connectionId: string,
) {
  try {
    const result = await nango.get<GoogleSheet>({
      endpoint: `/v4/spreadsheets/${spreadsheetId}`,
      providerConfigKey: integration,
      connectionId,
      retries: 5,
    });

    return result.data;
  } catch (error) {
    console.log(error);
  }
}

export async function addSheetEntry(
  connectionId: string,
  spreadsheetId: string,
  range: string,
  values: string[][],
) {
  const result = await nango.post<GoogleSheet>({
    endpoint: `/v4/spreadsheets/${spreadsheetId}/values/${range}:append`,
    providerConfigKey: integration,
    connectionId,
    retries: 5,
    params: {
      valueInputOption: "USER_ENTERED",
    },
    data: { values },
  });

  return result;
}

export async function updateSheetHeaders(
  connectionId: string,
  spreadsheetId: string,
  range: string,
  values: string[][],
) {
  const result = await nango.proxy<GoogleSheet>({
    method: "PUT",
    endpoint: `/v4/spreadsheets/${spreadsheetId}/values/${range}`,
    providerConfigKey: integration,
    connectionId,
    retries: 5,
    params: {
      valueInputOption: "USER_ENTERED",
    },
    data: { values },
  });

  return result;
}
