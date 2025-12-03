# Status of Excel/CSV Processor Implementation

## 1. Overview
The user requested an analysis of the difficulties inherent in converting Excel to CSV and a status report on which have been addressed in the current implementation.

## 2. Technical Difficulties (Excel to CSV)

| Difficulty | Description | Implementation Status | Notes |
| :--- | :--- | :--- | :--- |
| **Multi-sheet Support** | Excel files often contain multiple worksheets (tabs), whereas CSV is a flat file format representing a single table. Converting requires either merging, selecting one, or exporting multiple files. | **Completed** | Added logic to parse the full workbook, store it in memory, and provide a dropdown UI for the user to switch between sheets. |
| **Data Types & Formatting** | Excel has rich types (Date, Currency, Percentage). CSV is plain text. Preserving the *displayed* value vs. the *underlying* value is complex (e.g., date serial numbers). | **Partial** | Relying on `xlsx` library's `sheet_to_json` default behavior. It generally handles standard types well but may strip custom number formatting. |
| **Merged Cells** | Excel allows cells to span multiple rows/cols. CSV does not. Flattening this structure often results in empty cells or misalignment. | **Partial** | `sheet_to_json` handles this by filling the top-left cell value and leaving others undefined/null. No complex "fill-down" logic implemented. |
| **Large Files (Performance)** | Processing large Excel files (50MB+) in the browser main thread can freeze the UI or crash the tab due to memory limits. | **Not Started** | Current implementation loads the entire file into memory (`useState` and `useRef`). Requires Web Workers or streaming (e.g., `ExcelJS` streaming) for large scale support. |
| **Encoding** | Ensuring non-ASCII characters (Chinese, Emojis) are preserved when opening the CSV in tools like Excel (which often requires BOM). | **Completed** | `Papa.unparse` combined with Blob type `text/csv;charset=utf-8;` handles standard UTF-8. |
| **Formulas** | Excel cells may contain formulas (`=SUM(A1:B1)`). CSV usually needs the calculated value. | **Completed** | `xlsx` parser evaluates (or reads cached values of) formulas by default during conversion to JSON. |

## 3. Current Capabilities
*   **Import**: Supports `.csv`, `.xls`, `.xlsx`.
*   **View**: Renders data in a responsive HTML table with sticky headers.
*   **Search**: Client-side filtering of rows.
*   **Sheet Selection**: Dropdown appears when an Excel file has >1 sheets.
*   **Export**:
    *   **JSON**: Full dump of current sheet.
    *   **SQL**: Generates `INSERT INTO` statements.
    *   **CSV**: Generates standard CSV.
    *   **Excel**: Re-packages current data into a new `.xlsx` file.

## 4. Next Steps (Optimization)
To address the "Large Files" difficulty, future iterations should move the parsing logic to a **Web Worker** to prevent blocking the UI thread.
