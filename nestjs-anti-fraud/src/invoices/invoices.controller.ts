import { Controller, Get, Param, Query } from '@nestjs/common';
import { FindAllInvoiceDto } from './dto/find-all-invoice.dto';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private invoiceService: InvoicesService){}

  @Get()
  findAll(@Query() filter: FindAllInvoiceDto){
    return this.invoiceService.findAll({
      whithFraud: filter.with_fraud,
      accountId: filter.account_id
    })
  }

  @Get(':id')
  findOne(@Param('id') id: string){
    return this.invoiceService.findOne(id)
  }
}
