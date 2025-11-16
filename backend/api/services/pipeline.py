import csv
from datetime import datetime
from io import StringIO
from typing import Iterable

from fastapi import UploadFile
from sqlalchemy.orm import Session

from ..schemas.client import ClientCreate
from ..schemas.transcript import TranscriptCreate
from ..schemas.pipeline import CSVIngestResponse
from .transcripts import upsert_transcript
from .classify import classify_transcript


def _parse_bool(value: str | None) -> bool:
    return str(value or "").strip().lower() in {"1", "true", "yes", "y", "si"}


def _parse_datetime(value: str | None) -> datetime | None:
    if not value:
        return None
    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d", "%d/%m/%Y"):
        try:
            return datetime.strptime(value.strip(), fmt)
        except ValueError:
            continue
    return None


def _value_from_row(row: dict[str, str], keys: list[str]) -> str | None:
    for key in keys:
        if key in row and row[key] is not None:
            cleaned = row[key].strip()
            if cleaned:
                return cleaned
    return None


def _clean_row(row: dict[str, str]) -> tuple[ClientCreate, TranscriptCreate]:
    client_payload = ClientCreate(
        name=_value_from_row(row, ["Nombre", "name"]) or "Cliente sin nombre",
        email=_value_from_row(row, ["Correo Electronico", "email", "Email"]),
        phone=_value_from_row(row, ["Numero de Telefono", "telefono", "phone"]),
    )
    closed_raw = _value_from_row(row, ["closed", "Cerrado"])
    transcript_payload = TranscriptCreate(
        assigned_seller=_value_from_row(row, ["Vendedor asignado", "assigned_seller"]),
        meeting_date=_parse_datetime(_value_from_row(row, ["Fecha de la Reunion", "meeting_date"])),
        closed=_parse_bool(closed_raw) if closed_raw is not None else False,
        transcript=_value_from_row(row, ["Transcripcion", "transcript"]),
    )
    return client_payload, transcript_payload

async def ingest_csv(db: Session, upload: UploadFile) -> CSVIngestResponse:
    content = await upload.read()
    reader = csv.DictReader(StringIO(content.decode("utf-8")))
    processed = 0
    inserted_clients = 0
    inserted_transcripts = 0
    classified_transcripts = 0

    for row in reader:
        processed += 1
        client_payload, transcript_payload = _clean_row(row)
        transcript, client_created, transcript_created = upsert_transcript(
            db, client_payload, transcript_payload
        )
        if client_created:
            inserted_clients += 1
        if transcript_created:
            inserted_transcripts += 1
        classification = classify_transcript(db, transcript.id)
        if classification.created:
            classified_transcripts += 1

    return CSVIngestResponse(
        processed_rows=processed,
        inserted_clients=inserted_clients,
        inserted_transcripts=inserted_transcripts,
        classified_transcripts=classified_transcripts,
    )
