cube(`Sales`, {
  sql_table: `workspace.default.fct_sales`,

  measures: {
    count: {
      type: `count`,
      drillMembers: [orderId]
    },

    totalSales: {
      type: `sum`,
      sql: `sales`
    },

    totalQuantity: {
      type: `sum`,
      sql: `order_item_quantity`
    },

    averageSales: {
      type: `avg`,
      sql: `sales`
    },

    totalRevenue: {
      sql: `sales`,
      type: `sum`
    },

    totalProfit: {
      sql: `order_profit_per_order`,
      type: `sum`
    },

    totalCost: {
      sql: `sales - order_profit_per_order`,
      type: `sum`
    },

    profitMargin: {
      sql: `100.0 * SUM(order_profit_per_order) / NULLIF(SUM(sales), 0)`,
      type: `number`
    }
  },

  dimensions: {
    orderId: {
      sql: `order_item_id`,
      type: `string`,
      primaryKey: true
    },

    market: {
      sql: `market`,
      type: `string`
    },

    orderCity: {
      sql: `order_city`,
      type: `string`
    },

    orderState: {
      sql: `order_state`,
      type: `string`
    },

    orderDate: {
      sql: `order_date_dateorders`,
      type: `time`
    },

    shippingDate: {
      sql: `shipping_date_dateorders`,
      type: `time`
    },
    region: {
      sql: `region`,
      type: `string`
    },

    country: {
      sql: `order_country`,
      type: `string`
    },

    state: {
      sql: `order_state`,
      type: `string`
    },

    category: {
      sql: `category_name`,
      type: `string`
    },

    department: {
      sql: `department_name`,
      type: `string`
    },

    orderStatus: {
      sql: `order_status`,
      type: `string`
    },

    deliveryStatus: {
      sql: `delivery_status`,
      type: `string`
    }
  }
});
