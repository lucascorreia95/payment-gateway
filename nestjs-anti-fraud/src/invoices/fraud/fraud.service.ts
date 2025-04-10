import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProcessInvoiceFraudDto } from '../dto/process-invoice-fraud.dto';
import { Account, FraudReason, InvoiceStatus } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FraudService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
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

    const fraudResult = await this.detectFraud({ account, amount })

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

  async detectFraud(data: {account: Account, amount: number}) {
    const {account, amount} = data

    const SUSPICIOUS_VARIATION_PERCENTAGE = this.configService.getOrThrow<number>("SUSPICIOUS_VARIATION_PERCENTAGE")
    const INVOICES_HISTORY_COUNT = this.configService.getOrThrow<number>("INVOICES_HISTORY_COUNT")
    const SUSPICIOUS_INVOICES_COUNT = this.configService.getOrThrow<number>("SUSPICIOUS_INVOICES_COUNT")
    const SUSPICIOUS_TIMEFRAME_HOURS = this.configService.getOrThrow<number>("SUSPICIOUS_TIMEFRAME_HOURS")

    if(account.isSuspicious) {
      return {
        hasFraud: true,
        reason: FraudReason.SUSPICIOUS_ACCOUNT,
        description: 'Account is suspicious'
      }
    }

    const previousInvoices = await this.prismaService.invoice.findMany({
      where:{
        accountId: account.id
      }, orderBy: {
        createdAt: 'desc'
      }, take: INVOICES_HISTORY_COUNT,
    })

    if (previousInvoices.length) {
      const totalAmount = previousInvoices.reduce((acc, invoice) => {
        return acc + invoice.amount;
      }, 0)

      const averageAmount = totalAmount / previousInvoices.length

      if(amount > averageAmount * (1 + SUSPICIOUS_VARIATION_PERCENTAGE / 100) + averageAmount) {
        return {
          hasFraud: true,
          reason: FraudReason.UNUSUAL_PATTERN,
          description: `Amount ${amount} is higher than the average amount ${averageAmount}`
        }
      }

      const recentDate = new Date()
      recentDate.setHours(recentDate.getHours() - SUSPICIOUS_TIMEFRAME_HOURS)

      const recentInvoices = await this.prismaService.invoice.findMany({
        where: {
          accountId: account.id,
          createdAt: {
            gte: recentDate
          }
        }
      })

      if (recentInvoices.length > SUSPICIOUS_INVOICES_COUNT) {
        return {
          hasFraud: true,
          reason: FraudReason.FREQUENT_HIGH_VALUE,
          description: `Account ${account.id} has more than ${SUSPICIOUS_INVOICES_COUNT} invoices in the last 24 hours`
        }
      }
    }

    return {
      hasFraud: false,
    } 
  }
}
