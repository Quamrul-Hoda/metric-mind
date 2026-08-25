select *
from {{ source('metricmind', 'stg_dataco') }}
