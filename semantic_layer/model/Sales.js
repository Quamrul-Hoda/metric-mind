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
    }
  },

  dimensions: {
    orderId: {
      sql: `order_item_id`,
      type: `string`,
      primaryKey: true
    },

    orderStatus: {
      sql: `order_status`,
      type: `string`
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
    }
  }
});
