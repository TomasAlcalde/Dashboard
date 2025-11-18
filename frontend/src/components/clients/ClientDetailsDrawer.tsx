import type { ReactNode } from "react";

import { Chip, Divider, Drawer, Stack, Typography } from "@mui/material";

import type { ClientRecord } from "../../api/clients";
import { getLatestTranscript } from "./utils";

type ClientDetailsDrawerProps = {
  client: ClientRecord | null;
  onClose: () => void;
};

const ClientDetailsDrawer = ({
  client,
  onClose,
}: ClientDetailsDrawerProps) => {
  const latestTranscript = client ? getLatestTranscript(client) : null;

  return (
    <Drawer
      anchor="right"
      open={Boolean(client)}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: 320, md: 420 } } }}
    >
      {client ? (
        <Stack spacing={2} sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            {client.name}
          </Typography>

          {latestTranscript ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={latestTranscript.closed ? "Closed" : "Open"}
                color={latestTranscript.closed ? "success" : "warning"}
                size="small"
              />
              {latestTranscript.assigned_seller ? (
                <Chip
                  label={latestTranscript.assigned_seller}
                  size="small"
                  variant="outlined"
                />
              ) : null}
            </Stack>
          ) : null}

          <Divider flexItem />

          <DetailSection title="Clasificacion">
            {latestTranscript?.classification ? (
              <Stack spacing={1}>
                <InfoRow
                  label="Sentiment"
                  value={latestTranscript.classification.sentiment}
                />
                <InfoRow
                  label="Urgency"
                  value={latestTranscript.classification.urgency}
                />
                <InfoRow
                  label="Use case"
                  value={latestTranscript.classification.use_case}
                />
                <InfoRow
                  label="Fit score"
                  value={`${latestTranscript.classification.fit_score * 100}%`}
                />
                <InfoRow
                  label="Prob. cierre"
                  value={`${
                    latestTranscript.classification.close_probability * 100
                  }%`}
                />
                {latestTranscript.classification.objections ? (
                  <InfoRow
                    label="Objeciones"
                    value={latestTranscript.classification.objections}
                  />
                ) : null}
                {latestTranscript.classification.competitors ? (
                  <InfoRow
                    label="Competidores"
                    value={latestTranscript.classification.competitors}
                  />
                ) : null}
              </Stack>
            ) : (
              <Typography variant="body2">
                Sin clasificacion cargada aun.
              </Typography>
            )}
          </DetailSection>

          <Divider flexItem />

          <DetailSection title="Transcript">
            <Typography variant="body2" color="text.primary">
              {latestTranscript?.transcript ?? "Sin transcript."}
            </Typography>
          </DetailSection>
        </Stack>
      ) : null}
    </Drawer>
  );
};

type DetailSectionProps = {
  title: string;
  children: ReactNode;
};

const DetailSection = ({ title, children }: DetailSectionProps) => (
  <Stack spacing={1}>
    <Typography variant="subtitle2" color="text.secondary">
      {title}
    </Typography>
    {children}
  </Stack>
);

type InfoRowProps = {
  label: string;
  value: string;
};

const InfoRow = ({ label, value }: InfoRowProps) => (
  <Stack direction="row" justifyContent="space-between">
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={600}>
      {value}
    </Typography>
  </Stack>
);

export default ClientDetailsDrawer;
