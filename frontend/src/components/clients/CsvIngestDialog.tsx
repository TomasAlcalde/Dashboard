import { ChangeEvent, FormEvent, useState } from "react";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { isAxiosError } from "axios";

import type { CSVIngestResponse } from "../../api/ingest";
import { ingestClientsCsv } from "../../api/ingest";

type CsvIngestDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: (response: CSVIngestResponse) => void;
  onError?: (message: string) => void;
};

const CsvIngestDialog = ({
  open,
  onClose,
  onSuccess,
  onError,
}: CsvIngestDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const resetState = () => {
    setFile(null);
    setIsUploading(false);
  };

  const handleClose = () => {
    if (isUploading) {
      return;
    }
    resetState();
    onClose();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      return;
    }
    setIsUploading(true);
    try {
      const response = await ingestClientsCsv(file);
      onSuccess?.(response);
      handleClose();
    } catch (error) {
      let message = "Error al cargar el CSV.";
      if (isAxiosError(error)) {
        message =
          (error.response?.data as { detail?: string } | undefined)?.detail ??
          message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      onError?.(message);
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>Subir lista de transcritos</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Considerar que se procesan hasta 15 filas por minuto (free tier)
            </Typography>
            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadFileIcon />}
              disabled={isUploading}
            >
              Seleccionar CSV
              <input
                type="file"
                accept=".csv"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            {file ? (
              <Typography variant="body2" color="text.primary">
                Archivo seleccionado: {file.name}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No se ha seleccionado archivo.
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isUploading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!file || isUploading}
          >
            {isUploading ? "Procesando..." : "Ingestar CSV"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CsvIngestDialog;
