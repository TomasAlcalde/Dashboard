import apiClient from "./client";

export type CSVIngestResponse = {
  processed_rows: number;
  inserted_clients: number;
  inserted_transcripts: number;
  classified_transcripts: number;
};

export async function ingestClientsCsv(file: File): Promise<CSVIngestResponse> {
  const formData = new FormData();
  formData.append("upload", file);

  const { data } = await apiClient.post<CSVIngestResponse>(
    "/ingest/csv",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return data;
}

