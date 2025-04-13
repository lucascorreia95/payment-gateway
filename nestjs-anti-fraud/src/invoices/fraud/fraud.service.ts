import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProcessInvoiceFraudDto } from '../dto/process-invoice-fraud.dto';
import { InvoiceStatus } from '@prisma/client';
import { FraudAggregateSpecification } from './specification/fraud-aggregate.specification';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InvoiceProcessedEvent } from '../events/invoice-processed.event';

@Injectable()
export class FraudService {
  constructor(
    private prismaService: PrismaService,
    private fraudAggregateSpecification: FraudAggregateSpecification,
    private eventEmitter: EventEmitter2
  ){}

  async processInvoice(processInvoiceFraudDto: ProcessInvoiceFraudDto){
    const {invoice_id, account_id, amount} = processInvoiceFraudDto;

    const foundInvoice = await this.prismaService.invoice.findUnique({
      where: {
        id: invoice_id
      }
    })

    if (foundInvoice) {
      throw new Error('Invoice has already been processed')
    }

    const account = await this.prismaService.account.upsert({
      where: {
        id: account_id
      },
      update:{},
      create: {
        id: account_id
      }
    })

    const fraudResult = await this.fraudAggregateSpecification.detectFraud({ account, amount, invoiceId: invoice_id })

    const invoice = await this.prismaService.invoice.create({
      data:{
        id: invoice_id,
        accountId: account.id,
        amount,
        status: fraudResult.hasFraud ? InvoiceStatus.REJECTED : InvoiceStatus.APPROVED,
        ...(fraudResult.hasFraud && {
          fraudHistory: {
            create: {
              reason: fraudResult?.reason!,
              description: fraudResult?.description
            }
          }
        }),
      }
    })

    await this.eventEmitter.emitAsync(
      'invoice.processed',
      new InvoiceProcessedEvent(invoice, fraudResult)
    )

    return {
      invoice,
      fraudResult,
    }
  }
}
