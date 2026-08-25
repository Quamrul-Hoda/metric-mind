select
    order_item_id,
    order_id,
    customer_id,
    product_card_id,

    order_date_dateorders,
    shipping_date_dateorders,

    order_item_quantity,
    order_item_product_price,

    sales,
    order_item_discount,
    order_item_discount_rate,

    order_item_profit_ratio,
    order_profit_per_order,

    order_status,
    delivery_status,

    category_name,
    department_name,

    market,
    region,

    order_city,
    order_state,
    order_country

from {{ ref('int_sales') }}
