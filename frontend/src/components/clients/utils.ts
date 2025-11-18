import type { ClientRecord, TranscriptRecord } from "../../api/clients";

export const getLatestTranscript = (
  client?: ClientRecord | null
): TranscriptRecord | null => {
  if (!client) {
    return null;
  }
  const transcripts = client.transcripts ?? [];
  if (!transcripts.length) {
    return null;
  }
  const sorted = [...transcripts].sort((a, b) => {
    const timeA = a.meeting_date ? new Date(a.meeting_date).getTime() : 0;
    const timeB = b.meeting_date ? new Date(b.meeting_date).getTime() : 0;
    return timeA - timeB;
  });
  return sorted[sorted.length - 1];
};
