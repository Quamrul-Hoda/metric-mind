# MetricMind Build Log

##  Environment + Connectivity Risk Check

### Completed
- Initialized the MetricMind Git repository.
- Verified the required local development environment: Python, Node.js, Docker, Docker Compose, and Ollama.
- Verified the local Llama 3.1 8B model through Ollama.
- Configured and started Cube locally using Docker Compose.
- Configured Databricks SQL Warehouse connectivity for Cube.
- Verified the Cube → Databricks connection successfully.
- Confirmed that the PostgreSQL fallback is not required.


- Cube running locally at `http://localhost:4000`.
- Cube successfully connected to the Databricks SQL Warehouse.

## Data Ingestion

### Completed
- Finalized DataCo Smart Supply Chain as the MetricMind source dataset.
- Uploaded the raw CSV to the Databricks volume:
  `/Volumes/workspace/default/metricmind_raw/dataco/`
- Created the Databricks ingestion notebook:
  `01_databricks_ingestion`
- Read the CSV into a Spark DataFrame.
- Created the Raw Delta dataset.
- Successfully read the Raw Delta dataset back for verification.
- Verified the raw dataset schema and row count.
- Checked for missing values.
- Checked for duplicate records; duplicate row count was 0.

### Data Layer
- Source: DataCo Smart Supply Chain CSV
- Raw storage: Databricks Volume
- Raw analytical format: Delta

###
- Databricks notebook successfully displayed the source data and Raw Delta data.
- Raw Delta schema and row count were successfully verified.
- Duplicate rows: 0.

## Staging Transformations

- Loaded the Day 2 Raw Delta dataset from Databricks Volume.
- Created a staging transformation DataFrame.
- Standardized raw column names to snake_case.
- Converted order and shipping date fields to Spark date types.
- Preserved NULL values in incomplete source fields rather than fabricating values.
- Verified duplicate rows: 0.
- Standardized the region field.
- Added order year, month, and quarter fields.
- Wrote the transformed dataset as Staging Delta.
- Validated Raw vs Staging row counts.
- Validated key staging fields.
- Raw dataset remained unchanged.

## dbt Transformation Pipeline

### Completed
- Configured dbt Core with Databricks adapter.
- Configured Databricks connection through `profiles.yml`.
- Verified dbt connectivity with `dbt debug`.
- Registered `stg_dataco` as the dbt source.
- Created staging model `stg_dataco`.
- Added staging data-quality tests.
- Identified that `order_id` is not unique because the dataset contains multiple items per order.
- Validated `order_item_id` as the unique row/item identifier.
- Created intermediate model `int_sales`.
- Created mart model `fct_sales`.
- Verified the complete dbt dependency graph.
- Successfully executed the complete dbt build.

### Final dbt Build Result

PASS=5 
WARN=0 
ERROR=0 
SKIP=0 
NO-OP=0 
REUSED=0 
TOTAL=5

### dbt DAG

source:metricmind.metricmind.stg_dataco
        ↓
stg_dataco
        ↓
int_sales
        ↓
fct_sales

### Data Quality

- `order_item_id` NOT NULL — PASS
- `order_item_id` UNIQUE — PASS

## Cube Semantic Model Expansion

- Audited the existing Cube `Sales` semantic model.
- Added governed business measures:
  - Total Revenue
  - Total Profit
  - Total Cost
  - Profit Margin
- Added business dimensions:
  - Region
  - Country
  - State
  - Category
  - Department
  - Order Status
  - Delivery Status
- Added `orderDate` as a Cube time dimension.
- Validated Cube metadata after the model expansion.
- Validated monthly time-based revenue queries.
- Validated regional queries using revenue, profit, and profit margin.
- Confirmed Cube starts successfully with the expanded semantic model.
