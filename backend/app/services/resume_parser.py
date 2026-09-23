"""
Resume parsing service for extracting text from PDF files.
"""

from __future__ import annotations

import logging
from typing import Any

import pypdf

from app.core.config import settings

logger = logging.getLogger(__name__)


class ResumeParserError(Exception):
    """Base exception for resume parser errors."""


class InvalidPdfError(ResumeParserError):
    """Raised when the PDF is invalid or corrupted."""


class ScannedPdfError(ResumeParserError):
    """Raised when the PDF appears to be scanned (no extractable text)."""


class ResumeParser:
    """
    Service for parsing PDF resumes and extracting text.
    """

    def __init__(self, max_pages: int = 20) -> None:
        self.max_pages = max_pages
        logger.info("Initialized ResumeParser with max_pages=%d", max_pages)

    def parse_pdf(self, file_content: bytes) -> dict[str, Any]:
        """
        Parse a PDF file and extract text.

        Args:
            file_content: The raw bytes of the PDF file.

        Returns:
            A dictionary containing:
                - text: The extracted text (normalized whitespace)
                - page_count: Number of pages in the PDF
                - word_count: Approximate word count
                - character_count: Character count (without whitespace normalization)

        Raises:
            InvalidPdfError: If the PDF is invalid or corrupted.
            ScannedPdfError: If the PDF contains no extractable text.
        """
        try:
            pdf_reader = pypdf.PdfReader(file_content)
        except Exception as exc:
            logger.exception("Failed to read PDF")
            raise InvalidPdfError("The PDF file is invalid or corrupted.") from exc

        # Check if the PDF is encrypted
        if pdf_reader.is_encrypted:
            raise InvalidPdfError("The PDF file is encrypted and cannot be processed.")

        # Limit the number of pages
        total_pages = len(pdf_reader.pages)
        if total_pages > self.max_pages:
            raise InvalidPdfError(
                f"The PDF file has {total_pages} pages, which exceeds the maximum of {self.max_pages} pages."
            )

        # Extract text from each page
        extracted_text_parts: list[str] = []
        for page_num, page in enumerate(pdf_reader.pages):
            try:
                text = page.extract_text() or ""
                if text.strip():
                    extracted_text_parts.append(text)
            except Exception as exc:
                logger.warning("Failed to extract text from page %d", page_num, exc_info=exc)
                # Continue with other pages

        full_text = "\n\n".join(extracted_text_parts)

        # Check if we extracted any text
        if not full_text.strip():
            raise ScannedPdfError(
                "No text could be extracted from the PDF. The file may be scanned or image-based."
            )

        # Normalize whitespace: replace multiple spaces/newlines with a single space, but preserve paragraphs
        # We'll split by double newline to preserve paragraphs, then normalize within each paragraph.
        paragraphs = full_text.split("\n\n")
        normalized_paragraphs = []
        for para in paragraphs:
            # Replace any whitespace (including newlines and tabs) with a single space
            normalized = " ".join(para.split())
            normalized_paragraphs.append(normalized)
        normalized_text = "\n\n".join(normalized_paragraphs)

        # Count words and characters (without normalization)
        word_count = len(full_text.split())
        character_count = len(full_text)

        result = {
            "text": normalized_text,
            "page_count": total_pages,
            "word_count": word_count,
            "character_count": character_count,
        }

        logger.info(
            "Parsed PDF: %d pages, %d words, %d characters",
            total_pages,
            word_count,
            character_count,
        )

        return result

    def parse_text(self, text: str) -> dict[str, Any]:
        """
        Parse plain text resume.

        Args:
            text: The resume text.

        Returns:
            A dictionary containing:
                - text: The normalized text
                - page_count: 1 (since it's text)
                - word_count: Approximate word count
                - character_count: Character count
        """
        if not text or not text.strip():
            raise ValueError("Resume text is empty.")

        # Normalize whitespace similarly to PDF
        paragraphs = text.split("\n\n")
        normalized_paragraphs = []
        for para in paragraphs:
            normalized = " ".join(para.split())
            normalized_paragraphs.append(normalized)
        normalized_text = "\n\n".join(normalized_paragraphs)

        word_count = len(text.split())
        character_count = len(text)

        result = {
            "text": normalized_text,
            "page_count": 1,
            "word_count": word_count,
            "character_count": character_count,
        }

        logger.info(
            "Parsed text resume: 1 page, %d words, %d characters",
            word_count,
            character_count,
        )

        return result