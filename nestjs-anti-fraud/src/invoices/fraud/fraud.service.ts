import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProcessInvoiceFraudDto } from '../dto/process-invoice-fraud.dto';
import { Account, FraudReason, InvoiceStatus } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { FraudAggregateSpecification } from './specification/fraud-aggregate.specification';

@Injectable()
export class FraudService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
    private fraudAggregateSpecification: FraudAggregateSpecification,
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

    return {
      invoice,
      fraudResult,
    }
  }
}
