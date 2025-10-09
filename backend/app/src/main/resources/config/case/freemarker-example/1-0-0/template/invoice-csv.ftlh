Invoice Number;Client Name;Date;Total
<#list docs as doc>
    ${doc.invoiceNumber};${doc.clientName};${doc.invoiceDate};${doc.totalAmount}
</#list>
