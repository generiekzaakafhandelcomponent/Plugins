<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org">
<head>
  <meta charset="UTF-8" />
  <title>Invoice</title>
  <style>
      body {
          font-family: Arial, sans-serif;
          margin: 40px;
      }
      h1 {
          color: #333;
      }
      .header, .footer {
          text-align: center;
          font-size: 12px;
          color: #777;
      }
      .details {
          margin: 20px 0;
      }
      table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
      }
      th, td {
          border: 1px solid #ccc;
          padding: 8px;
          text-align: left;
      }
      th {
          background-color: #eee;
      }
      .total {
          text-align: right;
          font-weight: bold;
      }
  </style>
</head>
<body>

<div class="header">
  <p>Invoice generated with Freemarker</p>
</div>

<h1>Invoice</h1>

<div class="details">
  <p><strong>Client:</strong> ${doc.clientName?html}</p>
  <p><strong>Date:</strong> ${doc.invoiceDate?html}</p>
  <p><strong>Invoice Number:</strong> ${doc.invoiceNumber?html}</p>
</div>

<table>
  <thead>
  <tr>
    <th>Description</th>
    <th>Qty</th>
    <th>Unit Price</th>
    <th>Amount</th>
  </tr>
  </thead>
  <tbody>
  <#list doc.items as item>
    <tr>
      <td>${item.description?html}</td>
      <td>${item.quantity?html}</td>
      <td>${item.unitPrice?html}</td>
      <td>${item.total?html}</td>
    </tr>
  </#list>
  </tbody>
</table>

<p class="total">Total: ${doc.totalAmount?html}</p>

<div class="footer">
  <p>Thank you for your business!</p>
</div>

</body>
</html>
